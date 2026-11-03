import { useId, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function TextField({ label, error, hint, type = 'text', className = '', ...props }) {
  const id = useId()
  const [revealed, setRevealed] = useState(false)
  const isPassword = type === 'password'
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-stone-700 dark:text-stone-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && revealed ? 'text' : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          // 16px text keeps iOS Safari from zooming into the field
          className={`h-12 w-full rounded-xl border bg-white px-4 text-base text-stone-900 placeholder:text-stone-400 transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/15 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 ${
            error ? 'border-red-500' : 'border-stone-300 dark:border-stone-700'
          } ${isPassword ? 'pr-12' : ''}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
            aria-label={revealed ? 'Hide password' : 'Show password'}
          >
            {revealed ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-sm text-stone-500">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
