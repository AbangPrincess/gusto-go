import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { ArrowLeft, MapPin, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'
import CartLine from '../components/CartLine'
import { LocationModal } from '../components/LocationPicker'
import Modal from '../components/Modal'
import OrderSummary from '../components/OrderSummary'

export default function CartPage() {
  const { cart, clearCart, totalItemCount, totalPrice, deliveryAddress } = useCart()
  const [confirmClear, setConfirmClear] = useState(false)
  const [locationOpen, setLocationOpen] = useState(false)
  const navigate = useNavigate()

  // Checkout needs a delivery location first
  const proceed = () => (deliveryAddress ? navigate('/checkout') : setLocationOpen(true))
  const proceedLabel = deliveryAddress ? 'Go to checkout' : 'Set delivery location'

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-36 sm:px-6 sm:pt-10 lg:pb-16">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Back to menu"
          >
            <ArrowLeft className="size-5" />
          </Link>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Cart</h1>
        </div>
        {cart.length > 0 && (
          <Button variant="ghost" onClick={() => setConfirmClear(true)} className="text-red-600 dark:text-red-400">
            <Trash2 className="size-4" aria-hidden />
            Clear cart
          </Button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="mx-auto mt-16 max-w-sm text-center">
          <span className="mx-auto grid size-20 place-items-center rounded-full bg-stone-100 dark:bg-stone-900">
            <ShoppingBag className="size-9 text-stone-400" aria-hidden />
          </span>
          <h2 className="mt-5 text-xl font-semibold">The cart is empty.</h2>
          <p className="mt-2 text-stone-500 dark:text-stone-400">Browse the menu and add something you like.</p>
          <Link
            to="/"
            className="mt-6 inline-flex h-12 items-center rounded-xl bg-brand-600 px-6 font-semibold text-white hover:bg-brand-700"
          >
            Browse menu
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
          <ul className="divide-y divide-stone-200 self-start rounded-2xl bg-white ring-1 ring-stone-200 dark:divide-stone-800 dark:bg-stone-900 dark:ring-stone-800">
            {cart.map((item) => (
              <CartLine key={`${item.food.id}-${item.addons.map((a) => a.name).join('|')}`} item={item} />
            ))}
          </ul>

          <aside className="self-start rounded-2xl bg-white p-5 ring-1 ring-stone-200 lg:sticky lg:top-[calc(5rem+env(safe-area-inset-top))] dark:bg-stone-900 dark:ring-stone-800">
            <h2 className="text-lg font-semibold">Order summary</h2>
            <div className="mt-3 flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
              <p className="min-w-0 flex-1 text-stone-600 dark:text-stone-300">
                {deliveryAddress || 'No delivery location set yet.'}
              </p>
              <button
                type="button"
                onClick={() => setLocationOpen(true)}
                className="shrink-0 font-semibold text-brand-700 hover:underline dark:text-brand-400"
              >
                {deliveryAddress ? 'Change' : 'Set'}
              </button>
            </div>
            <div className="mt-4">
              <OrderSummary itemCount={totalItemCount} subtotal={totalPrice} />
            </div>
            <div className="mt-5 hidden lg:block">
              <Button size="lg" className="w-full" onClick={proceed}>
                {proceedLabel}
              </Button>
            </div>
          </aside>
        </div>
      )}

      {cart.length > 0 && (
        <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 px-4 pt-3 backdrop-blur lg:hidden dark:border-stone-800 dark:bg-stone-950/95">
          <div className="mx-auto max-w-xl">
            <Button size="lg" className="mb-3 w-full" onClick={proceed}>
              {proceedLabel}
            </Button>
          </div>
        </div>
      )}

      <LocationModal open={locationOpen} onClose={() => setLocationOpen(false)} />

      <Modal
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        title="Are you sure you want to clear the cart?"
        description="All items will be removed."
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirmClear(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                clearCart()
                setConfirmClear(false)
              }}
            >
              Yes, clear cart
            </Button>
          </>
        }
      />
    </div>
  )
}
