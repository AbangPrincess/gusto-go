import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router'
import { ShoppingBag } from 'lucide-react'
import { CATEGORIES, MENU, RESTAURANT_NAME } from '../data/menu'
import { useCart } from '../context/CartContext'
import CartBar from '../components/CartBar'
import CartLine from '../components/CartLine'
import CategoryTabs from '../components/CategoryTabs'
import DeliveryInfo from '../components/DeliveryInfo'
import FoodCard from '../components/FoodCard'
import LocationPicker from '../components/LocationPicker'
import OrderSummary from '../components/OrderSummary'

// Desktop sidebar: the cart stays in view while browsing
function MiniCart() {
  const { cart, totalItemCount, totalPrice } = useCart()
  return (
    <aside className="sticky top-[calc(5rem+env(safe-area-inset-top))] hidden self-start rounded-2xl bg-white p-5 ring-1 ring-stone-200 lg:block dark:bg-stone-900 dark:ring-stone-800">
      <h2 className="text-lg font-semibold">Your order</h2>
      {cart.length === 0 ? (
        <div className="py-10 text-center">
          <ShoppingBag className="mx-auto size-10 text-stone-300 dark:text-stone-700" aria-hidden />
          <p className="mt-3 text-sm text-stone-500 dark:text-stone-400">Your cart is empty. Pick something tasty from the menu.</p>
        </div>
      ) : (
        <>
          <ul className="mt-2 max-h-[45vh] divide-y divide-stone-200 overflow-y-auto dark:divide-stone-800">
            {cart.map((item) => (
              <CartLine key={`${item.food.id}-${item.addons.map((a) => a.name).join('|')}`} item={item} compact />
            ))}
          </ul>
          <div className="mt-3 border-t border-stone-200 pt-4 dark:border-stone-800">
            <OrderSummary itemCount={totalItemCount} subtotal={totalPrice} />
          </div>
          <Link
            to="/cart"
            className="mt-5 flex h-12 items-center justify-center rounded-xl bg-brand-600 font-semibold text-white hover:bg-brand-700"
          >
            Go to cart
          </Link>
        </>
      )}
    </aside>
  )
}

// Phones and tablets: every category sits side by side and snaps, so the menu can be swiped
// left/right (native momentum on iOS and Android). Desktop shows only the selected category.
function MenuPanels({ category, onSwipe }) {
  const trackRef = useRef(null)
  const settleTimer = useRef()
  const hasSynced = useRef(false)
  const activeIndex = CATEGORIES.findIndex((c) => c.id === category)

  // Bring the selected category into view after a tab tap, back navigation or resize
  useEffect(() => {
    const track = trackRef.current
    const sync = (behavior) => {
      const panel = track.querySelector(`[data-category="${category}"]`)
      if (panel && Math.abs(track.scrollLeft - panel.offsetLeft) > 2) {
        track.scrollTo({ left: panel.offsetLeft, behavior })
      }
    }
    sync(hasSynced.current ? 'smooth' : 'auto')
    hasSynced.current = true
    const onResize = () => sync('auto')
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [category])

  useEffect(() => () => clearTimeout(settleTimer.current), [])

  // Once a swipe settles, select the category that snapped into place
  const onScroll = () => {
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const track = trackRef.current
      if (!track || track.scrollWidth <= track.clientWidth) return
      const panels = [...track.children]
      const nearest = panels.reduce((best, panel) =>
        Math.abs(panel.offsetLeft - track.scrollLeft) < Math.abs(best.offsetLeft - track.scrollLeft) ? panel : best,
      )
      if (nearest.dataset.category !== category) onSwipe(nearest.dataset.category)
    }, 120)
  }

  return (
    <div
      ref={trackRef}
      onScroll={onScroll}
      className="scrollbar-none relative flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain lg:block lg:overflow-visible"
    >
      {CATEGORIES.map(({ id }, index) => (
        <section
          key={id}
          id={`panel-${id}`}
          data-category={id}
          role="tabpanel"
          aria-labelledby={`tab-${id}`}
          inert={id !== category ? true : undefined}
          className={`w-full shrink-0 snap-start snap-always ${id === category ? '' : 'lg:hidden'}`}
        >
          <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
            {MENU.filter((food) => food.category === id).map((food) => (
              <li key={food.id} className="flex">
                <div className="w-full">
                  {/* Load the visible category and its neighbours right away so swiping never shows blanks */}
                  <FoodCard food={food} eager={Math.abs(index - activeIndex) <= 1} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [params, setParams] = useSearchParams()
  const requested = params.get('category')
  const category = CATEGORIES.some((c) => c.id === requested) ? requested : CATEGORIES[0].id

  const selectCategory = (id) => setParams({ category: id }, { replace: true, preventScrollReset: true })

  return (
    <div className="mx-auto max-w-6xl px-4 pb-32 sm:px-6 lg:pb-16">
      <section className="pt-6 pb-2 sm:pt-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-700 dark:text-brand-400">Gusto Go Delivery</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">{RESTAURANT_NAME}</h1>
            <div className="mt-5">
              <LocationPicker />
            </div>
          </div>
          <DeliveryInfo className="w-full md:w-auto md:min-w-80" />
        </div>
      </section>

      <div className="sticky top-[calc(4rem+env(safe-area-inset-top))] z-20 -mx-4 mt-4 border-b border-stone-200 bg-stone-50/95 px-4 backdrop-blur sm:-mx-6 sm:px-6 dark:border-stone-800 dark:bg-stone-950/95">
        <CategoryTabs value={category} onChange={selectCategory} />
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_20rem]">
        <div className="min-w-0">
          <MenuPanels category={category} onSwipe={selectCategory} />
        </div>
        <MiniCart />
      </div>

      <CartBar />
    </div>
  )
}
