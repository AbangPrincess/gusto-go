import { useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import { ArrowLeft, Check } from 'lucide-react'
import { CATEGORIES, findFood } from '../data/menu'
import { useCart } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { formatPrice } from '../lib/format'
import Button from '../components/Button'
import FoodImage from '../components/FoodImage'
import NotFoundPage from './NotFoundPage'

export default function FoodPage() {
  const { id } = useParams()
  const food = findFood(id)
  const navigate = useNavigate()
  const location = useLocation()
  const { addToCart } = useCart()
  const showToast = useToast()
  const [selected, setSelected] = useState([])

  if (!food) return <NotFoundPage />

  const menuLink = `/?category=${food.category}`
  const categoryLabel = CATEGORIES.find((c) => c.id === food.category)?.label
  const total = food.price + selected.reduce((sum, addon) => sum + addon.price, 0)

  const toggle = (addon) =>
    setSelected((current) =>
      current.includes(addon) ? current.filter((a) => a !== addon) : [...current, addon],
    )

  // Go back to where the user came from when it was inside the app
  const goBack = () => (location.key !== 'default' ? navigate(-1) : navigate(menuLink))

  // Take the customer straight to the cart so they can see what they added
  const handleAdd = () => {
    addToCart(food, selected)
    showToast(`${food.name} added to cart`)
    navigate('/cart')
  }

  return (
    <div className="mx-auto max-w-6xl pb-32 md:px-6 md:pt-8 md:pb-16">
      <nav className="mb-6 hidden items-center gap-2 text-sm md:flex" aria-label="Breadcrumb">
        <Link to="/" className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
          Menu
        </Link>
        <span className="text-stone-300 dark:text-stone-700">/</span>
        <Link to={menuLink} className="text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100">
          {categoryLabel}
        </Link>
        <span className="text-stone-300 dark:text-stone-700">/</span>
        <span className="font-medium" aria-current="page">{food.name}</span>
      </nav>

      <div className="grid md:grid-cols-2 md:gap-10 lg:gap-14">
        <div className="relative">
          <FoodImage
            food={food}
            eager
            sizes="(min-width: 768px) 560px, 100vw"
            className="aspect-square h-auto w-full md:aspect-[4/3.4] md:rounded-3xl"
          />
          <button
            type="button"
            onClick={goBack}
            className="absolute top-[calc(env(safe-area-inset-top)+1rem)] left-4 grid size-11 place-items-center rounded-full bg-white/90 text-stone-900 shadow-md backdrop-blur md:hidden"
            aria-label="Back to menu"
          >
            <ArrowLeft className="size-5" />
          </button>
        </div>

        <div className="px-4 pt-6 md:px-0 md:pt-2">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-400">{categoryLabel}</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">{food.name}</h1>
          <p className="mt-2 text-xl font-semibold">{formatPrice(food.price)}</p>
          <p className="mt-4 leading-relaxed text-stone-600 dark:text-stone-300">{food.description}</p>

          <fieldset className="mt-8">
            <legend className="flex w-full items-baseline justify-between">
              <span className="text-lg font-semibold">Add-ons</span>
              <span className="text-sm text-stone-500 dark:text-stone-400">Optional</span>
            </legend>
            <div className="mt-3 divide-y divide-stone-200 overflow-hidden rounded-2xl border border-stone-200 bg-white dark:divide-stone-800 dark:border-stone-800 dark:bg-stone-900">
              {food.addons.map((addon) => {
                const checked = selected.includes(addon)
                return (
                  <label
                    key={addon.name}
                    className="group flex min-h-14 cursor-pointer items-center gap-4 px-4 py-3 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/60"
                  >
                    <input type="checkbox" checked={checked} onChange={() => toggle(addon)} className="peer sr-only" />
                    <span
                      className={`grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-brand-500 peer-focus-visible:ring-offset-2 ${
                        checked ? 'border-brand-600 bg-brand-600 text-white' : 'border-stone-300 dark:border-stone-600'
                      }`}
                      aria-hidden
                    >
                      {checked && <Check className="size-4" strokeWidth={3} />}
                    </span>
                    {/* Bold on hover; stays bold once ticked */}
                    <span className={`flex-1 ${checked ? 'font-bold' : 'font-medium group-hover:font-bold'}`}>{addon.name}</span>
                    <span
                      className={`text-sm tabular-nums ${
                        checked
                          ? 'font-bold text-stone-900 dark:text-stone-100'
                          : 'text-stone-500 group-hover:font-bold group-hover:text-stone-900 dark:text-stone-400 dark:group-hover:text-stone-100'
                      }`}
                    >
                      +{formatPrice(addon.price)}
                    </span>
                  </label>
                )
              })}
            </div>
          </fieldset>

          <div className="pb-safe fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 px-4 pt-3 backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:p-0 dark:border-stone-800 dark:bg-stone-950/95 md:dark:bg-transparent">
            <Button size="lg" className="mb-3 w-full md:mb-0" onClick={handleAdd}>
              Add to cart · {formatPrice(total)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
