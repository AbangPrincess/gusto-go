// Text-only wordmark used inside the app (the "G" mark is for the app icon and favicon)
export default function Logo({ size = 'md' }) {
  return (
    <span className={`${size === 'lg' ? 'text-3xl' : 'text-xl'} font-extrabold tracking-tight`}>
      Gusto <span className="text-brand-700 dark:text-brand-500">Go</span>
    </span>
  )
}
