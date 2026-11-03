// The circular "G" mark (same drawing as public/favicon.svg). Transparent outside the circle.
export default function LogoMark({ className = 'size-20' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Gusto Go">
      <circle cx="32" cy="32" r="32" fill="#c2410c" />
      <g fill="#fff" stroke="#fff" transform="translate(1.5 -0.3)">
        <path d="M41.3 19.7A16 16 0 1 0 46.5 36" fill="none" strokeWidth="7" />
        <path d="M30 32h13" fill="none" strokeWidth="6" />
        <path d="M41 24.5 51 32l-1.2 5-6.7-1.8L41 35z" stroke="none" />
      </g>
    </svg>
  )
}
