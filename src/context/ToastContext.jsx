import { createContext, use, useCallback, useRef, useState } from 'react'
import { CheckCircle2, Info } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timer = useRef()

  const showToast = useCallback((message, tone = 'success') => {
    clearTimeout(timer.current)
    setToast({ message, tone, key: Date.now() })
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const Icon = toast?.tone === 'info' ? Info : CheckCircle2

  return (
    <ToastContext value={showToast}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-[60] flex justify-center px-4"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 6rem)' }}
      >
        {toast && (
          <div
            key={toast.key}
            className="animate-toast flex items-center gap-2 rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-white shadow-lg dark:bg-stone-100 dark:text-stone-900"
          >
            <Icon className="size-4 shrink-0 text-brand-400 dark:text-brand-600" aria-hidden />
            {toast.message}
          </div>
        )}
      </div>
    </ToastContext>
  )
}

export const useToast = () => use(ToastContext)
