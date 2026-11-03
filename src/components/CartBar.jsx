import { Link } from 'react-router'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { formatPrice } from '../lib/format'

// Floating "view cart" bar for phones and tablets
export default function CartBar() {
  const { totalItemCount, totalPrice } = useCart()
  if (!totalItemCount) return null

  return (
    <div className="pb-safe fixed inset-x-0 bottom-0 z-30 px-4 pt-3 lg:hidden">
      <Link
        to="/cart"
        className="mx-auto mb-3 flex h-14 max-w-xl items-center gap-3 rounded-2xl bg-brand-600 px-4 text-white shadow-lg shadow-brand-900/20 active:bg-brand-700"
      >
        <span className="grid size-8 place-items-center rounded-lg bg-white/20 text-sm font-bold">{totalItemCount}</span>
        <span className="font-semibold">View cart</span>
        <span className="ml-auto flex items-center gap-2 font-semibold">
          {formatPrice(totalPrice)}
          <ShoppingBag className="size-5" aria-hidden />
        </span>
      </Link>
    </div>
  )
}
