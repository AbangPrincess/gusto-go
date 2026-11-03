// Food photo served as a small (480px) or large (960px) WebP; the browser picks
// the right one for the screen size and pixel density.
export default function FoodImage({ food, sizes = '480px', eager = false, alt = food.name, className = '' }) {
  return (
    <img
      src={`${food.image}-480.webp`}
      srcSet={`${food.image}-480.webp 480w, ${food.image}-960.webp 960w`}
      sizes={sizes}
      width={480}
      height={480}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      className={`bg-stone-200 object-cover dark:bg-stone-800 ${className}`}
    />
  )
}
