import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import { ArrowLeft, Lock, MapPin } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'
import { formatCardNumber, formatExpiry, maskCardNumber, validateCard, digitsOnly, cardBrand } from '../lib/card'
import Button from '../components/Button'
import CreditCardPreview from '../components/CreditCardPreview'
import Modal from '../components/Modal'
import OrderSummary from '../components/OrderSummary'
import TextField from '../components/TextField'
import { DELIVERY_FEE } from '../data/menu'

const EMPTY = { number: '', expiry: '', holder: '', cvv: '' }

export default function CheckoutPage() {
  const { cart, totalItemCount, totalPrice, deliveryAddress, placeOrder } = useCart()
  const navigate = useNavigate()
  const [card, setCard] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [cvvFocused, setCvvFocused] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [placing, setPlacing] = useState(false)
  const [orderError, setOrderError] = useState('')

  // While an order is being placed the cart empties, so don't bounce back to /cart
  if ((cart.length === 0 || !deliveryAddress) && !placing) return <Navigate to="/cart" replace />

  const update = (field, value) => {
    setCard((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const userTappedPay = (e) => {
    e.preventDefault()
    const next = validateCard(card)
    setErrors(next)
    // only show the confirmation if the form is valid
    if (Object.keys(next).length === 0) {
      setOrderError('')
      setConfirming(true)
    }
  }

  const confirmPayment = async () => {
    setPlacing(true)
    setOrderError('')
    try {
      await placeOrder()
      setCard(EMPTY)
      navigate('/delivery', { replace: true })
    } catch {
      setOrderError('We couldn’t place your order. Check your connection and try again.')
      setPlacing(false)
    }
  }

  const total = totalPrice + DELIVERY_FEE

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-36 sm:px-6 sm:pt-10 lg:pb-16">
      <div className="flex items-center gap-2">
        <Link
          to="/cart"
          className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-stone-100 dark:hover:bg-stone-800"
          aria-label="Back to cart"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Checkout</h1>
      </div>

      <form id="payment-form" onSubmit={userTappedPay} noValidate className="mt-6 grid gap-6 lg:grid-cols-[1fr_22rem] lg:gap-8">
        <section className="rounded-2xl bg-white p-5 ring-1 ring-stone-200 sm:p-8 dark:bg-stone-900 dark:ring-stone-800">
          <h2 className="text-lg font-semibold">Payment details</h2>
          <div className="mt-6">
            <CreditCardPreview {...card} showBack={cvvFocused} />
          </div>

          <div className="mx-auto mt-8 grid max-w-lg gap-4 sm:grid-cols-2">
            <TextField
              className="sm:col-span-2"
              label="Card number"
              inputMode="numeric"
              autoComplete="cc-number"
              placeholder="XXXX XXXX XXXX XXXX"
              value={card.number}
              onChange={(e) => update('number', formatCardNumber(e.target.value))}
              error={errors.number}
            />
            <TextField
              label="Expiry date"
              inputMode="numeric"
              autoComplete="cc-exp"
              placeholder="MM/YY"
              value={card.expiry}
              onChange={(e) => update('expiry', formatExpiry(e.target.value))}
              error={errors.expiry}
            />
            <TextField
              label="CVV"
              inputMode="numeric"
              autoComplete="cc-csc"
              placeholder="XXX"
              type="password"
              value={card.cvv}
              onChange={(e) => update('cvv', digitsOnly(e.target.value).slice(0, cardBrand(card.number) === 'amex' ? 4 : 3))}
              onFocus={() => setCvvFocused(true)}
              onBlur={() => setCvvFocused(false)}
              error={errors.cvv}
            />
            <TextField
              className="sm:col-span-2"
              label="Card holder name"
              autoComplete="cc-name"
              autoCapitalize="words"
              value={card.holder}
              onChange={(e) => update('holder', e.target.value)}
              error={errors.holder}
            />
          </div>

          <p className="mx-auto mt-6 flex max-w-lg items-start gap-2 text-xs text-stone-500 dark:text-stone-400">
            <Lock className="mt-0.5 size-3.5 shrink-0" aria-hidden />
            Card details stay on this device. They are never saved or sent with your order.
          </p>
        </section>

        <aside className="self-start rounded-2xl bg-white p-5 ring-1 ring-stone-200 lg:sticky lg:top-[calc(5rem+env(safe-area-inset-top))] dark:bg-stone-900 dark:ring-stone-800">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <p className="mt-3 flex items-start gap-2 text-sm text-stone-600 dark:text-stone-300">
            <MapPin className="mt-0.5 size-4 shrink-0 text-brand-600" aria-hidden />
            {deliveryAddress}
          </p>
          <div className="mt-4">
            <OrderSummary itemCount={totalItemCount} subtotal={totalPrice} />
          </div>
          <div className="mt-5 hidden lg:block">
            <Button type="submit" size="lg" className="w-full">
              Pay now · {formatPrice(total)}
            </Button>
          </div>
        </aside>
      </form>

      <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 px-4 pt-3 backdrop-blur lg:hidden dark:border-stone-800 dark:bg-stone-950/95">
        <div className="mx-auto max-w-xl">
          <Button type="submit" form="payment-form" size="lg" className="mb-3 w-full">
            Pay now · {formatPrice(total)}
          </Button>
        </div>
      </div>

      <Modal
        open={confirming}
        onClose={() => !placing && setConfirming(false)}
        title="Confirm payment"
        description={`You’ll be charged ${formatPrice(total)}.`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={placing}>
              Cancel
            </Button>
            <Button onClick={confirmPayment} loading={placing}>
              Yes, place order
            </Button>
          </>
        }
      >
        <dl className="space-y-2 rounded-xl bg-stone-50 p-4 text-sm dark:bg-stone-800/60">
          {[
            ['Card number', maskCardNumber(card.number)],
            ['Expiry date', card.expiry],
            ['Card holder name', card.holder.trim()],
            ['CVV', '•••'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-stone-500 dark:text-stone-400">{label}</dt>
              <dd className="truncate font-medium">{value}</dd>
            </div>
          ))}
        </dl>
        {orderError && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {orderError}
          </p>
        )}
      </Modal>
    </div>
  )
}
