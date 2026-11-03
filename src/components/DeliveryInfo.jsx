import { Clock, Truck } from 'lucide-react'
import { DELIVERY_FEE, DELIVERY_TIME } from '../data/menu'
import { formatPrice } from '../lib/format'

export default function DeliveryInfo({ className = '' }) {
  const items = [
    { icon: Truck, value: formatPrice(DELIVERY_FEE), label: 'Delivery fee' },
    { icon: Clock, value: DELIVERY_TIME, label: 'Delivery time' },
  ]
  return (
    <dl className={`grid grid-cols-2 divide-x divide-stone-200 rounded-2xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900 ${className}`}>
      {items.map(({ icon: Icon, value, label }) => (
        <div key={label} className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
          <Icon className="size-5 shrink-0 text-brand-600 dark:text-brand-500" aria-hidden />
          <div className="flex flex-col-reverse">
            <dt className="text-xs text-stone-500 dark:text-stone-400">{label}</dt>
            <dd className="font-semibold">{value}</dd>
          </div>
        </div>
      ))}
    </dl>
  )
}
