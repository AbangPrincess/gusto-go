import { DELIVERY_FEE } from '../data/menu'
import { formatPrice } from '../lib/format'

export default function OrderSummary({ itemCount, subtotal }) {
  const rows = [
    [`Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`, formatPrice(subtotal)],
    ['Delivery fee', formatPrice(DELIVERY_FEE)],
  ]
  return (
    <dl className="space-y-2 text-sm">
      {rows.map(([label, value]) => (
        <div key={label} className="flex justify-between gap-4">
          <dt className="text-stone-500 dark:text-stone-400">{label}</dt>
          <dd className="tabular-nums">{value}</dd>
        </div>
      ))}
      <div className="flex justify-between gap-4 border-t border-stone-200 pt-3 text-base font-semibold dark:border-stone-800">
        <dt>Total</dt>
        <dd className="tabular-nums">{formatPrice(subtotal + DELIVERY_FEE)}</dd>
      </div>
    </dl>
  )
}
