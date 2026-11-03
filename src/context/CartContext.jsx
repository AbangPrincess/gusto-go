import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react'
import { DELIVERY_FEE, findFood } from '../data/menu'
import { formatAddons, formatDateTime, formatPrice, lineTotal } from '../lib/format'
import { readJSON, writeJSON } from '../lib/storage'
import { saveOrder } from '../services/orders'

const CartContext = createContext(null)

const sameAddons = (a, b) =>
  a.length === b.length && a.every((addon, i) => addon.name === b[i].name)

// Rebuild cart items from saved ids so menu changes never leave stale prices behind
const hydrate = (saved) =>
  (saved ?? []).flatMap(({ foodId, addonNames, quantity }) => {
    const food = findFood(foodId)
    if (!food || !(quantity > 0)) return []
    const addons = food.addons.filter((addon) => addonNames.includes(addon.name))
    return [{ food, addons, quantity }]
  })

const dehydrate = (cart) =>
  cart.map((item) => ({
    foodId: item.food.id,
    addonNames: item.addons.map((addon) => addon.name),
    quantity: item.quantity,
  }))

export function buildReceipt({ items, address, date, itemCount, subtotal, total }) {
  const lines = ["Here's your receipt.", '', formatDateTime(date), '', '----------']
  for (const item of items) {
    lines.push(`${item.quantity} x ${item.food.name} - ${formatPrice(item.food.price)}`)
    if (item.addons.length) lines.push(`  Addons: ${formatAddons(item.addons)}`)
    lines.push('')
  }
  lines.push(
    '----------',
    '',
    `Total Items: ${itemCount}`,
    `Total Price: ${formatPrice(subtotal)}`,
    `Delivery Fee: ${formatPrice(DELIVERY_FEE)}`,
    `Amount Due: ${formatPrice(total)}`,
    '',
    `Delivering to: ${address}`,
  )
  return lines.join('\n')
}

// One provider per signed-in user (keyed by uid in App), so carts never mix between accounts
export function CartProvider({ user, children }) {
  const storageKey = `gusto-cart-${user.uid}`
  const saved = useMemo(() => readJSON(storageKey, {}), [storageKey])

  const [cart, setCart] = useState(() => hydrate(saved.cart))
  // { address, lat?, lng?, accuracy? } — no made-up default; the customer sets it
  const [deliveryLocation, setDeliveryLocation] = useState(saved.location ?? null)
  const [lastOrder, setLastOrder] = useState(saved.lastOrder ?? null)

  useEffect(() => {
    writeJSON(storageKey, { cart: dehydrate(cart), location: deliveryLocation, lastOrder })
  }, [storageKey, cart, deliveryLocation, lastOrder])

  // Same food with the same add-ons stacks; anything else is a new line
  const addToCart = useCallback((food, addons, quantity = 1) => {
    const ordered = food.addons.filter((addon) => addons.some((a) => a.name === addon.name))
    setCart((current) => {
      const index = current.findIndex(
        (item) => item.food.id === food.id && sameAddons(item.addons, ordered),
      )
      if (index === -1) return [...current, { food, addons: ordered, quantity }]
      return current.map((item, i) =>
        i === index ? { ...item, quantity: item.quantity + quantity } : item,
      )
    })
  }, [])

  const removeFromCart = useCallback((target) => {
    setCart((current) =>
      current.flatMap((item) => {
        if (item.food.id !== target.food.id || !sameAddons(item.addons, target.addons)) return [item]
        return item.quantity > 1 ? [{ ...item, quantity: item.quantity - 1 }] : []
      }),
    )
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  // coords come from GPS or a picked search result; a typed address alone has none
  const updateDeliveryAddress = useCallback((address, coords = null) => {
    const trimmed = address.trim()
    if (trimmed) setDeliveryLocation({ address: trimmed, ...coords })
  }, [])

  const deliveryAddress = deliveryLocation?.address ?? ''
  const deliveryCoords = useMemo(
    () =>
      deliveryLocation?.lat != null ? { lat: deliveryLocation.lat, lng: deliveryLocation.lng } : null,
    [deliveryLocation],
  )

  const totalItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cart.reduce((sum, item) => sum + lineTotal(item), 0)

  const placeOrder = useCallback(async () => {
    const date = new Date()
    const order = {
      items: cart,
      address: deliveryAddress,
      location: deliveryCoords,
      date,
      itemCount: totalItemCount,
      subtotal: totalPrice,
      deliveryFee: DELIVERY_FEE,
      total: totalPrice + DELIVERY_FEE,
      uid: user.uid,
      email: user.email,
    }
    order.receipt = buildReceipt(order)
    const id = await saveOrder(order)
    setLastOrder({
      id,
      receipt: order.receipt,
      placedAt: date.toISOString(),
      total: order.total,
      location: deliveryCoords,
    })
    setCart([])
  }, [cart, deliveryAddress, deliveryCoords, totalItemCount, totalPrice, user.uid, user.email])

  const value = {
    cart,
    deliveryAddress,
    deliveryLocation,
    deliveryCoords,
    lastOrder,
    totalItemCount,
    totalPrice,
    addToCart,
    removeFromCart,
    clearCart,
    updateDeliveryAddress,
    placeOrder,
  }

  return <CartContext value={value}>{children}</CartContext>
}

export const useCart = () => use(CartContext)
