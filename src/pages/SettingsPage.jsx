import { LogOut, Moon } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { signOut } from '../services/auth'

function Switch({ checked, onChange, labelledBy }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-labelledby={labelledBy}
      onClick={onChange}
      className={`relative h-8 w-13 shrink-0 rounded-full transition-colors ${
        checked ? 'bg-green-500' : 'bg-stone-300 dark:bg-stone-700'
      }`}
    >
      <span
        className={`absolute top-1 left-1 size-6 rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-5' : ''
        }`}
      />
    </button>
  )
}

export default function SettingsPage() {
  const { isDarkMode, toggleTheme } = useTheme()
  const { user } = useAuth()

  return (
    <div className="mx-auto max-w-2xl px-4 pt-6 pb-16 sm:px-6 sm:pt-10">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>

      <section className="mt-6">
        <h2 className="px-1 text-sm font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">Appearance</h2>
        <div className="mt-2 rounded-2xl bg-white ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-800">
          <div className="flex items-center gap-4 p-4 sm:p-5">
            <span className="grid size-10 place-items-center rounded-full bg-stone-100 dark:bg-stone-800">
              <Moon className="size-5" aria-hidden />
            </span>
            <div className="flex-1">
              <p id="dark-mode-label" className="font-semibold">Dark Mode</p>
              <p className="text-sm text-stone-500 dark:text-stone-400">Easier on the eyes at night.</p>
            </div>
            <Switch checked={isDarkMode} onChange={toggleTheme} labelledBy="dark-mode-label" />
          </div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="px-1 text-sm font-semibold tracking-wide text-stone-500 uppercase dark:text-stone-400">Account</h2>
        <div className="mt-2 divide-y divide-stone-200 rounded-2xl bg-white ring-1 ring-stone-200 dark:divide-stone-800 dark:bg-stone-900 dark:ring-stone-800">
          <div className="p-4 sm:p-5">
            <p className="text-sm text-stone-500 dark:text-stone-400">Signed in as</p>
            <p className="truncate font-semibold">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-b-2xl p-4 text-left font-semibold text-red-600 hover:bg-stone-50 sm:p-5 dark:text-red-400 dark:hover:bg-stone-800/60"
          >
            <LogOut className="size-5" aria-hidden />
            Log out
          </button>
        </div>
      </section>
    </div>
  )
}
