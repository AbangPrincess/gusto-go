import LogoMark from './LogoMark'

// Full-screen splash: only the circular logo on the page's own background.
// `leaving` fades it out before it is removed.
export default function Splash({ leaving = false }) {
  return (
    <div
      role="status"
      aria-label="Loading Gusto Go"
      className={`fixed inset-0 z-[100] grid place-items-center bg-stone-50 transition-opacity duration-500 ease-out dark:bg-stone-950 ${
        leaving ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <LogoMark className="animate-splash size-24 drop-shadow-lg sm:size-28" />
    </div>
  )
}
