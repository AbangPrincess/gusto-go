import { useEffect, useState } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import AppLayout from './components/AppLayout'
import Splash from './components/Splash'
import ScrollToTop from './components/ScrollToTop'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import HomePage from './pages/HomePage'
import FoodPage from './pages/FoodPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import DeliveryPage from './pages/DeliveryPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

// Signed-in area: everything here needs an account (same as the original auth gate)
function RequireAuth() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Splash />
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />
  return (
    <CartProvider key={user.uid} user={user}>
      <Outlet />
    </CartProvider>
  )
}

function GuestOnly() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <Splash />
  if (user) return <Navigate to={location.state?.from?.pathname ?? '/'} replace />
  return <Outlet />
}

const SPLASH_MS = 3000
const SPLASH_FADE_MS = 500

// Shows the logo for 3 seconds whenever the site is opened, then fades out.
// The app keeps loading underneath, so the page is ready when the splash leaves.
function StartupSplash() {
  const [phase, setPhase] = useState('show') // show → leaving → done
  useEffect(() => {
    const leave = setTimeout(() => setPhase('leaving'), SPLASH_MS)
    const done = setTimeout(() => setPhase('done'), SPLASH_MS + SPLASH_FADE_MS)
    return () => {
      clearTimeout(leave)
      clearTimeout(done)
    }
  }, [])
  return phase === 'done' ? null : <Splash leaving={phase === 'leaving'} />
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <StartupSplash />
          <ScrollToTop />
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route element={<RequireAuth />}>
              <Route element={<AppLayout />}>
                <Route index element={<HomePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/delivery" element={<DeliveryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/food/:id" element={<FoodPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
