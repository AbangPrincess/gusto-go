import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useMatch } from 'react-router'
import { Home, LogOut, Menu, Settings, ShoppingBag, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { signOut } from '../services/auth'
import Logo from './Logo'

const NAV = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/settings', label: 'Settings', icon: Settings },
]

function CartButton() {
  const { totalItemCount } = useCart()
  return (
    <Link
      to="/cart"
      className="relative grid size-11 place-items-center rounded-full text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800"
      aria-label={`Cart, ${totalItemCount} ${totalItemCount === 1 ? 'item' : 'items'}`}
    >
      <ShoppingBag className="size-6" />
      {totalItemCount > 0 && (
        <span className="absolute top-1 right-1 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white ring-2 ring-white dark:ring-stone-950">
          {totalItemCount > 99 ? '99+' : totalItemCount}
        </span>
      )}
    </Link>
  )
}

function Drawer({ open, onClose }) {
  const ref = useRef(null)
  const { user } = useAuth()

  useEffect(() => {
    const dialog = ref.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const linkClass = ({ isActive }) =>
    `flex h-12 items-center gap-4 rounded-xl px-4 text-[15px] font-medium transition-colors ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400'
        : 'text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800'
    }`

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label="Main menu"
      className="m-0 h-dvh max-h-none w-[min(20rem,85vw)] max-w-none"
    >
      <nav className="pt-safe pb-safe flex h-full flex-col bg-white px-4 shadow-xl dark:bg-stone-900">
        <div className="flex items-center justify-between py-4">
          <Logo />
          <button
            type="button"
            onClick={onClose}
            className="grid size-11 place-items-center rounded-full text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
            aria-label="Close menu"
          >
            <X className="size-5" />
          </button>
        </div>
        {user?.email && (
          <p className="truncate px-1 pb-4 text-sm text-stone-500 dark:text-stone-400">
            Signed in as <span className="font-medium text-stone-700 dark:text-stone-300">{user.email}</span>
          </p>
        )}
        <div className="mb-3 border-t border-stone-200 dark:border-stone-800" />
        <div className="space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass} onClick={onClose}>
              <Icon className="size-5" aria-hidden />
              {label}
            </NavLink>
          ))}
        </div>
        <div className="mt-auto pb-4">
          <button
            type="button"
            onClick={signOut}
            className="flex h-12 w-full items-center gap-4 rounded-xl px-4 text-[15px] font-medium text-stone-700 hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800"
          >
            <LogOut className="size-5" aria-hidden />
            Log out
          </button>
        </div>
      </nav>
    </dialog>
  )
}

export default function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const onFoodPage = useMatch('/food/:id')


  const desktopLink = ({ isActive }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
      isActive
        ? 'text-brand-700 dark:text-brand-400'
        : 'text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
    }`

  return (
    <div className="flex min-h-dvh flex-col">
      <header
        className={`pt-safe sticky top-0 z-40 border-b border-stone-200/80 bg-white/85 backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/85 ${
          onFoodPage ? 'hidden md:block' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="-ml-2 grid size-11 place-items-center rounded-full text-stone-700 hover:bg-stone-100 md:hidden dark:text-stone-200 dark:hover:bg-stone-800"
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>
          <Link to="/" className="rounded-lg" aria-label="Gusto Go home">
            <Logo />
          </Link>
          <nav className="ml-8 hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} className={desktopLink}>
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <CartButton />
            <button
              type="button"
              onClick={signOut}
              className="hidden h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-stone-600 hover:bg-stone-100 hover:text-stone-900 md:inline-flex dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100"
            >
              <LogOut className="size-4" aria-hidden />
              Log out
            </button>
          </div>
        </div>
      </header>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
