import { addDoc, collection } from 'firebase/firestore'
import { db } from '../firebase'

const TIMEOUT_MS = 15000

// Saves an order to the "orders" collection. Keeps the original `date` and
// `order` (receipt text) fields and adds structured details alongside them.
export async function saveOrder(order) {
  const write = addDoc(collection(db, 'orders'), {
    date: order.date,
    order: order.receipt,
    uid: order.uid,
    email: order.email,
    address: order.address,
    location: order.location,
    items: order.items.map((item) => ({
      name: item.food.name,
      price: item.food.price,
      quantity: item.quantity,
      addons: item.addons,
    })),
    itemCount: order.itemCount,
    subtotal: order.subtotal,
    deliveryFee: order.deliveryFee,
    total: order.total,
  })

  // addDoc waits for the server; don't leave the customer hanging when offline
  let timer
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
  })
  try {
    const ref = await Promise.race([write, timeout])
    return ref.id
  } finally {
    clearTimeout(timer)
  }
}
