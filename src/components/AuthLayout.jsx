import { DELIVERY_TIME, RESTAURANT_NAME } from '../data/menu'
import FoodSlideshow from './FoodSlideshow'
import Logo from './Logo'

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden lg:block">
        <FoodSlideshow />
        {/* Soft shade only behind the text, so the photo stays bright */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-1/2 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        <div className="relative z-30 flex h-full flex-col justify-end p-12 text-white">
          <p className="text-sm font-semibold tracking-wide text-brand-200 uppercase">{RESTAURANT_NAME}</p>
          <h2 className="mt-2 max-w-md text-4xl leading-tight font-bold [text-shadow:0_1px_12px_rgb(0_0_0/0.35)]">
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
