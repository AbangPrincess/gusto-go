import { Link } from 'react-router'
import { SearchX } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="pt-safe grid min-h-[70dvh] place-items-center px-6 text-center">
      <div>
        <SearchX className="mx-auto size-12 text-stone-300 dark:text-stone-700" aria-hidden />
        <h1 className="mt-4 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-stone-500 dark:text-stone-400">We couldn’t find what you were looking for.</p>
        <Link
          to="/"
          className="mt-6 inline-flex h-11 items-center rounded-xl bg-brand-600 px-5 font-semibold text-white hover:bg-brand-700"
        >
          Back to menu
        </Link>
      </div>
    </div>
  )
}
