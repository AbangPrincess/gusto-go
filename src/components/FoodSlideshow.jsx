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

const HOLD_MS = 3500 // how long each photo stays
const FADE_MS = 900 // crossfade length: quick, with a soft ease in and out

// One full-bleed food photo at a time. Each new photo softly fades in over the
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
            className={`absolute inset-0 size-full object-cover transition-[opacity,scale] ease-[cubic-bezier(0.45,0,0.55,1)] ${
              role === 'current' ? 'z-10 opacity-100' : role === 'previous' ? 'z-0 opacity-100' : 'z-0 opacity-0'
            } ${role === 'next' ? 'scale-100' : 'scale-[1.06]'}`}
          />
        )
      })}
    </div>
  )
}
