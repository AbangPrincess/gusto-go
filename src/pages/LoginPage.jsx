import { useState } from 'react'
import { Link } from 'react-router'
import { MailCheck } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Button from '../components/Button'
import Modal from '../components/Modal'
import TextField from '../components/TextField'
import { authErrorMessage, resetPassword, signIn } from '../services/auth'

function ForgotPassword({ open, onClose, initialEmail }) {
  const [email, setEmail] = useState(initialEmail)
  const [status, setStatus] = useState('idle') // idle | sending | sent
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setStatus('sending')
    try {
      await resetPassword(email)
      setStatus('sent')
    } catch (err) {
      setError(authErrorMessage(err))
      setStatus('idle')
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Reset your password"
      description={status === 'sent' ? undefined : 'We’ll email you a link to set a new password.'}
    >
      {status === 'sent' ? (
        <div className="text-center">
          <MailCheck className="mx-auto size-10 text-brand-600" aria-hidden />
          <p className="mt-3 text-stone-600 dark:text-stone-300">
            If an account exists for <strong>{email.trim()}</strong>, a reset link is on its way.
          </p>
          <Button className="mt-6 w-full" onClick={onClose}>
            Back to sign in
          </Button>
        </div>
      ) : (
        <form onSubmit={submit} noValidate className="space-y-4">
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            required
          />
          <Button type="submit" className="w-full" loading={status === 'sending'} disabled={!email.trim()}>
            Send reset link
          </Button>
        </form>
      )}
    </Modal>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotOpen, setForgotOpen] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      await signIn(email, password)
      // the route guard sends the user on once Firebase reports the session
    } catch (err) {
      setError(authErrorMessage(err))
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to order from Gusto Go.">
      <form onSubmit={submit} noValidate className="space-y-4">
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div>
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="mt-2 text-right">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-sm font-medium text-brand-700 hover:underline dark:text-brand-400"
            >
              Forgot password?
            </button>
          </div>
        </div>

        {error && (
          <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-400">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" className="w-full" loading={loading}>
          Sign in
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-stone-600 dark:text-stone-400">
        Not a member?{' '}
        <Link to="/register" className="font-semibold text-brand-700 hover:underline dark:text-brand-400">
          Register now
        </Link>
      </p>

      {forgotOpen && (
        <ForgotPassword open onClose={() => setForgotOpen(false)} initialEmail={email} />
      )}
    </AuthLayout>
  )
}
