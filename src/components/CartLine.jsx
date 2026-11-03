import { useCart } from '../context/CartContext'
import { formatPrice, lineTotal } from '../lib/format'
import AddonChips from './AddonChips'
import FoodImage from './FoodImage'
import QuantitySelector from './QuantitySelector'

// Same layout at every screen size:
//   [photo] [name, unit price]     [price]
//   [photo] [add-ons ›  ]   [delete − 1 +]
// Add-ons and the controls share one row (add-ons scroll sideways if they don't fit); the controls
// share the price's right edge and sit on the photo's bottom line, so every row has the same height.
export default function CartLine({ item, compact = false }) {
  const { addToCart, removeFromCart } = useCart()
  const { food, addons, quantity } = item

  return (
    <li
      className={`grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_1fr] gap-x-3 ${
        compact ? 'py-3' : 'p-3 sm:gap-x-4 sm:p-4'
      }`}
    >
      <FoodImage
        food={food}
        alt=""
        sizes="96px"
        className={`${compact ? 'size-16' : 'size-24'} row-span-2 rounded-xl`}
      />

      <div className="min-w-0">
        <p className={`font-semibold leading-snug line-clamp-2 ${compact ? 'text-sm' : ''}`}>{food.name}</p>
        <p className="text-sm text-stone-500 dark:text-stone-400">{formatPrice(food.price)}</p>
      </div>

      <p className={`text-right font-semibold leading-snug tabular-nums ${compact ? 'text-sm' : ''}`}>
        {formatPrice(lineTotal(item))}
      </p>

      <div className="col-span-2 col-start-2 mt-1.5 flex items-center gap-3 self-end">
        <div className="min-w-0 flex-1">{addons.length > 0 && <AddonChips addons={addons} />}</div>
        <QuantitySelector
          size={compact ? 'sm' : 'md'}
          name={food.name}
          quantity={quantity}
          onDecrement={() => removeFromCart(item)}
          onIncrement={() => addToCart(food, addons)}
        />
      </div>
    </li>
  )
}
