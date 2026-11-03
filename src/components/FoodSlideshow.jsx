import { useEffect, useState } from 'react'
import { findFood } from '../data/menu'

const SLIDES = [
  'classic-cheeseburger',
  'strawberry-salad',
  'leche-flan',
  'mango-juice',
  'korean-bbq-burger',
  'caesar-salad',
  'buko-pie',
  'sweet-potato-fries',
  'avocado-salad',
  'buko-pandan-drink',
].map(findFood)

const HOLD_MS = 5000 // how long each photo stays
const FADE_MS = 1600 // crossfade length

// One full-bleed food photo at a time. Each new photo slowly fades in over the
// previous one while drifting into a gentle zoom. Only the photos on screen
// (previous, current, next) are in the page, so it stays light to load.
export default function FoodSlideshow() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    // Respect "reduce motion": keep the first photo still
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), HOLD_MS)
    return () => clearInterval(timer)
  }, [])

  const at = (offset) => (index + offset + SLIDES.length) % SLIDES.length
  const visible = new Map([
    [at(-1), 'previous'],
    [at(0), 'current'],
    [at(1), 'next'],
  ])

  return (
    <div className="absolute inset-0 overflow-hidden bg-stone-200" aria-hidden>
      {SLIDES.map((food, i) => {
        const role = visible.get(i)
        if (!role) return null
        return (
          <img
            key={food.id}
            src={`${food.image}-960.webp`}
            alt=""
            decoding="async"
            fetchPriority={role === 'current' ? 'high' : 'low'}
            style={{ transitionDuration: `${FADE_MS}ms, ${HOLD_MS + FADE_MS}ms` }}
            // The new photo fades in on top while the previous one stays fully visible underneath,
            // so the picture never dims mid-transition
            className={`absolute inset-0 size-full object-cover transition-[opacity,scale] ease-in-out ${
              role === 'current' ? 'z-10 opacity-100' : role === 'previous' ? 'z-0 opacity-100' : 'z-0 opacity-0'
            } ${role === 'next' ? 'scale-100' : 'scale-[1.06]'}`}
          />
        )
      })}
      <p className="absolute top-6 left-8 z-20 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold text-stone-800 shadow-sm backdrop-blur">
        {SLIDES[index].name}
      </p>
    </div>
  )
}
