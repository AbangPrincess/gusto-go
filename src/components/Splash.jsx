import Logo from './Logo'

export default function Splash() {
  return (
    <div className="grid min-h-dvh place-items-center" role="status" aria-label="Loading">
      <div className="animate-pulse">
        <Logo size="lg" />
      </div>
    </div>
  )
}
