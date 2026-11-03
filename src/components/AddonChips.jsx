import { useEffect, useRef, useState } from 'react'
import { formatPrice } from '../lib/format'

// One line of add-on chips that scrolls sideways when it doesn't fit.
// The edges fade only on the side where more chips are hidden.
export default function AddonChips({ addons }) {
  const ref = useRef(null)
  const [fade, setFade] = useState({ left: false, right: false })

  const update = () => {
    const el = ref.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    setFade({ left: el.scrollLeft > 1, right: el.scrollLeft < max - 1 })
  }

  useEffect(() => {
    const el = ref.current
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const mask = `linear-gradient(to right, ${fade.left ? 'transparent, #000 1.5rem' : '#000'}, ${
    fade.right ? '#000 calc(100% - 1.5rem), transparent' : '#000'
  })`

  return (
    <ul
      ref={ref}
      onScroll={update}
      aria-label="Add-ons"
      className="scrollbar-none flex min-w-0 gap-1.5 overflow-x-auto overscroll-x-contain"
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    >
      {addons.map((addon) => (
        <li
          key={addon.name}
          className="shrink-0 rounded-full border border-stone-200 px-2.5 py-0.5 text-xs whitespace-nowrap text-stone-600 dark:border-stone-700 dark:text-stone-300"
        >
          {addon.name} ({formatPrice(addon.price)})
        </li>
      ))}
    </ul>
  )
}
