import { DELIVERY_TIME, RESTAURANT_NAME } from '../data/menu'
import Logo from './Logo'

const COLLAGE = [
  '/images/burgers/classic-cheeseburger-960.webp',
  '/images/salads/strawberry-salad-960.webp',
  '/images/desserts/leche-flan-960.webp',
  '/images/drinks/mango-juice-960.webp',
]

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden bg-stone-900 lg:block">
        <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-1 opacity-70">
          {COLLAGE.map((src) => (
            <img key={src} src={src} alt="" decoding="async" className="size-full bg-stone-800 object-cover" />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/10" />
        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <p className="text-sm font-semibold tracking-wide text-brand-300 uppercase">{RESTAURANT_NAME}</p>
          <h2 className="mt-2 max-w-md text-4xl leading-tight font-bold">
            Burgers, salads and Filipino favourites, delivered in {DELIVERY_TIME}.
          </h2>
        </div>
      </aside>

      <section className="pt-safe pb-safe flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-sm">
          <Logo size="lg" />
          <h1 className="mt-8 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-2 text-stone-500 dark:text-stone-400">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </section>
    </div>
  )
}
