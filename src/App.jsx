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

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
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
