import { useEffect, useRef } from 'react'
import { CATEGORIES } from '../data/menu'

// WAI-ARIA tabs: arrow keys move between categories
export default function CategoryTabs({ value, onChange }) {
  const refs = useRef({})
  const listRef = useRef(null)

  // Keep the selected tab centred in the strip (e.g. after swiping the menu)
  useEffect(() => {
    const list = listRef.current
    const tab = refs.current[value]
    if (!list || !tab || list.scrollWidth <= list.clientWidth) return
    list.scrollTo({ left: tab.offsetLeft - (list.clientWidth - tab.offsetWidth) / 2, behavior: 'smooth' })
  }, [value])

  const onKeyDown = (e, index) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[e.key]
    if (!step) return
    e.preventDefault()
    const next = CATEGORIES[(index + step + CATEGORIES.length) % CATEGORIES.length]
    onChange(next.id)
    refs.current[next.id]?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Menu categories"
      className="scrollbar-none relative -mx-4 flex gap-2 overflow-x-auto px-4 py-3 sm:mx-0 sm:px-0"
    >
      {CATEGORIES.map((category, index) => {
        const selected = category.id === value
        return (
          <button
            key={category.id}
            ref={(el) => (refs.current[category.id] = el)}
            role="tab"
            id={`tab-${category.id}`}
            aria-selected={selected}
            aria-controls={`panel-${category.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(category.id)}
            onKeyDown={(e) => onKeyDown(e, index)}
            className={`flex h-10 shrink-0 items-center rounded-full px-5 text-sm font-semibold transition-colors ${
              selected
                ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900'
                : 'bg-white text-stone-600 ring-1 ring-stone-200 hover:bg-stone-100 dark:bg-stone-900 dark:text-stone-300 dark:ring-stone-800 dark:hover:bg-stone-800'
            }`}
          >
            {category.label}
          </button>
        )
      })}
    </div>
  )
}
