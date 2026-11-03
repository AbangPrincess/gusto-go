import { useState } from 'react'
import { Link } from 'react-router'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import TextField from '../components/TextField'
import { authErrorMessage, signUp } from '../services/auth'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const next = {}
    if (!email.trim()) next.email = 'Please enter your email address.'
    if (password.length < 6) next.password = 'Password should be at least 6 characters.'
    if (password !== confirmPassword) next.confirmPassword = 'Passwords don’t match.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    try {
      await signUp(email, password)
      // Firebase signs the new user in; the route guard takes them to the menu
    } catch (err) {
      setErrors({ form: authErrorMessage(err) })
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Let’s create an account for you" subtitle="It only takes a minute.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          hint="At least 6 characters."
          required
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          required
        />

        {errors.form && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {errors.form}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign up
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-600 dark:text-stone-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          Login now
        </Link>
      </p>
    </AuthLayout>
  )
}
