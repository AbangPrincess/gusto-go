import { Link, Navigate } from 'react-router'
import { CheckCircle2, Clock, MessageCircle, Phone, User } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { DELIVERY_TIME } from '../data/menu'
import { formatTime } from '../lib/format'
import LocationMap from '../components/LocationMap'

function DriverCard() {
  const showToast = useToast()
  const unavailable = () => showToast('Driver contact isn’t available yet.', 'info')

  return (
    <div className="flex items-center gap-3">
      <span className="grid size-12 shrink-0 place-items-center rounded-full bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-300">
        <User className="size-6" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="truncate font-semibold">John Dela Cruz</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">Driver</p>
      </div>
      <div className="ml-auto flex gap-2">
        <button
          type="button"
          onClick={unavailable}
          className="grid size-11 place-items-center rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
          aria-label="Message driver"
        >
          <MessageCircle className="size-5" />
        </button>
        <button
          type="button"
          onClick={unavailable}
          className="grid size-11 place-items-center rounded-full bg-green-600 text-white hover:bg-green-700"
          aria-label="Call driver"
        >
          <Phone className="size-5" />
        </button>
      </div>
    </div>
  )
}

export default function DeliveryPage() {
  const { lastOrder } = useCart()
  if (!lastOrder) return <Navigate to="/" replace />

  const placedAt = new Date(lastOrder.placedAt)
  const from = new Date(placedAt.getTime() + 15 * 60000)
  const to = new Date(placedAt.getTime() + 30 * 60000)

  return (
    <div className="mx-auto max-w-2xl px-4 pt-8 pb-40 sm:px-6 sm:pt-12 md:pb-16">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-14 text-green-600" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold tracking-tight sm:text-3xl">Thank you for your order!</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">Your order is confirmed and on its way to the kitchen.</p>
      </div>

      <div className="mt-8 flex items-center gap-3 rounded-2xl bg-brand-50 p-4 text-brand-900 dark:bg-brand-500/10 dark:text-brand-200">
        <Clock className="size-6 shrink-0" aria-hidden />
        <p>
          Estimated delivery time is <strong>{DELIVERY_TIME}</strong>
          <span className="block text-sm opacity-80">
            Arriving between {formatTime(from)} and {formatTime(to)}
          </span>
        </p>
      </div>

      {lastOrder.location && (
        <section className="mt-6" aria-label="Delivery location">
          <LocationMap coords={lastOrder.location} className="h-48 sm:h-56" />
        </section>
      )}

      <section className="mt-6 rounded-2xl bg-white p-5 ring-1 ring-stone-200 sm:p-6 dark:bg-stone-900 dark:ring-stone-800" aria-label="Receipt">
        <pre className="overflow-x-auto font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-stone-700 sm:text-sm dark:text-stone-300">
          {lastOrder.receipt}
        </pre>
      </section>

      <div className="mt-6 hidden rounded-2xl bg-white p-5 ring-1 ring-stone-200 md:block dark:bg-stone-900 dark:ring-stone-800">
        <DriverCard />
      </div>

      <div className="mt-8 text-center">
        <Link to="/" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          Back to menu
        </Link>
      </div>

      {/* Phones: driver bar pinned to the bottom like the original app */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 rounded-t-3xl border-t border-stone-200 bg-white px-5 pt-4 shadow-[0_-8px_24px_rgb(0_0_0/0.06)] md:hidden dark:border-stone-800 dark:bg-stone-900">
        <div className="mb-4">
          <DriverCard />
        </div>
      </div>
    </div>
  )
}
