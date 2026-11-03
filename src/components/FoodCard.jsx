import { Link } from 'react-router'
import { Plus } from 'lucide-react'
import { formatPrice } from '../lib/format'
import FoodImage from './FoodImage'

// Row layout on phones (text left, photo right), card layout from tablet up.
// On hover the whole card eases up 2px with a soft shadow, like Grab-style cards
// (hover only applies on devices with a pointer).
export default function FoodCard({ food, eager = false }) {
  return (
    <Link
      to={`/food/${food.id}`}
      className="group flex h-full gap-4 rounded-2xl bg-white p-3 ring-1 ring-stone-200 transition-[translate,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-0.5 hover:shadow-md hover:shadow-stone-900/[0.07] hover:ring-stone-300 sm:flex-col sm:gap-0 sm:overflow-hidden sm:p-0 motion-reduce:hover:translate-y-0 dark:bg-stone-900 dark:ring-stone-800 dark:hover:shadow-black/30 dark:hover:ring-stone-700"
    >
      <div className="order-2 shrink-0 sm:order-1">
        <FoodImage
          food={food}
          eager={eager}
          sizes="(min-width: 640px) 360px, 112px"
          className="size-28 rounded-xl sm:aspect-[4/3] sm:h-auto sm:w-full sm:rounded-none"
        />
      </div>
      <div className="order-1 flex min-w-0 flex-1 flex-col sm:order-2 sm:p-4">
        <h3 className="font-semibold leading-snug">{food.name}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-stone-500 sm:line-clamp-2 dark:text-stone-400">{food.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <span className="font-semibold text-brand-700 dark:text-brand-400">{formatPrice(food.price)}</span>
          <span
            className="grid size-8 place-items-center rounded-full bg-stone-100 text-stone-700 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white dark:bg-stone-800 dark:text-stone-200"
            aria-hidden
          >
            <Plus className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
