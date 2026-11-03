import { Minus, Plus, Trash2 } from 'lucide-react'

export default function QuantitySelector({ quantity, onIncrement, onDecrement, name, size = 'md' }) {
  const button =
    size === 'sm'
      ? 'size-8'
      : 'size-10'
  const iconClass = 'size-4'
  return (
    <div className="inline-flex items-center rounded-full bg-stone-100 p-1 dark:bg-stone-800">
      <button
        type="button"
        onClick={onDecrement}
        className={`${button} grid place-items-center rounded-full text-stone-700 hover:bg-white dark:text-stone-200 dark:hover:bg-stone-700`}
        aria-label={quantity > 1 ? `Remove one ${name}` : `Remove ${name} from cart`}
      >
        {quantity > 1 ? <Minus className={iconClass} /> : <Trash2 className={iconClass} />}
      </button>
      <span className="w-8 text-center text-sm font-semibold tabular-nums" aria-live="polite">
        {quantity}
      </span>
      <button
        type="button"
        onClick={onIncrement}
        className={`${button} grid place-items-center rounded-full text-stone-700 hover:bg-white dark:text-stone-200 dark:hover:bg-stone-700`}
        aria-label={`Add one more ${name}`}
      >
        <Plus className={iconClass} />
      </button>
    </div>
  )
}
