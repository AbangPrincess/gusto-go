import { useEffect, useState } from 'react'
import { ChevronDown, Crosshair, Loader2, MapPin, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getCurrentPosition, reverseGeocode, searchAddresses } from '../services/location'
import Button from './Button'
import LocationMap from './LocationMap'
import Modal from './Modal'
import TextField from './TextField'

function LocationForm({ onDone }) {
  const { deliveryAddress, deliveryLocation, deliveryCoords, updateDeliveryAddress } = useCart()
  const [draft, setDraft] = useState(deliveryAddress)
  const [pin, setPin] = useState(
    deliveryCoords ? { ...deliveryCoords, accuracy: deliveryLocation?.accuracy } : null,
  )
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState('')

  // Search as the customer types (debounced)
  useEffect(() => {
    if (query.trim().length < 3) return
    const controller = new AbortController()
    const timer = setTimeout(async () => {
      setSearching(true)
      try {
        setResults(await searchAddresses(query, { near: pin, signal: controller.signal }))
      } catch (err) {
        if (err.name !== 'AbortError') setResults([])
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 350)
    return () => {
      clearTimeout(timer)
      controller.abort()
    }
    // pin only biases results; re-searching when it changes isn't needed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const onType = (value) => {
    setDraft(value)
    setQuery(value)
    setError('')
    if (value.trim().length < 3) {
      setResults([])
      setSearching(false)
    }
  }

  const pick = (result) => {
    setDraft(result.label)
    setPin({ lat: result.lat, lng: result.lng })
    setQuery('')
    setResults([])
  }

  const useCurrentLocation = async () => {
    setError('')
    setLocating(true)
    setQuery('')
    setResults([])
    try {
      const position = await getCurrentPosition()
      setPin(position)
      try {
        setDraft(await reverseGeocode(position))
      } catch {
        setError('Your pin is set, but we couldn’t look up the street name. Type your address below.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLocating(false)
    }
  }

  const save = (e) => {
    e.preventDefault()
    updateDeliveryAddress(draft, pin)
    onDone()
  }

  return (
    <form onSubmit={save} className="space-y-4">
      <Button variant="secondary" className="w-full" onClick={useCurrentLocation} loading={locating}>
        {!locating && <Crosshair className="size-4" aria-hidden />}
        {locating ? 'Finding your location…' : 'Use my current location'}
      </Button>

      <div className="relative">
        <TextField
          label="Delivery address"
          placeholder="Search street, barangay or landmark"
          autoComplete="street-address"
          value={draft}
          onChange={(e) => onType(e.target.value)}
          hint="Add your house number, building or a landmark so the driver finds you."
        />
        {searching && (
          <Loader2 className="absolute top-[2.9rem] right-3 size-4 animate-spin text-stone-400" aria-hidden />
        )}
        {results.length > 0 && (
          <ul
            aria-label="Address suggestions"
            className="absolute inset-x-0 top-[5.1rem] z-10 max-h-60 overflow-y-auto rounded-xl bg-white py-1 shadow-lg ring-1 ring-stone-200 dark:bg-stone-900 dark:ring-stone-700"
          >
            {results.map((result) => (
              <li key={`${result.label}-${result.lat}`}>
                <button
                  type="button"
                  onClick={() => pick(result)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left text-sm hover:bg-stone-50 dark:hover:bg-stone-800"
                >
                  <MapPin className="mt-0.5 size-4 shrink-0 text-stone-400" aria-hidden />
                  {result.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
          {error}
        </p>
      )}

      {pin && (
        <div>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 text-stone-600 dark:text-stone-300">
              Pin set{pin.accuracy ? ` · ±${pin.accuracy} m` : ''}
            </span>
            <button
              type="button"
              onClick={() => setPin(null)}
              className="inline-flex shrink-0 items-center gap-1 font-medium text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
            >
              <X className="size-3.5" aria-hidden />
              Remove pin
            </button>
          </div>
          <LocationMap coords={pin} />
        </div>
      )}

      <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onDone}>
          Cancel
        </Button>
        <Button type="submit" disabled={!draft.trim()}>
          Save
        </Button>
      </div>
    </form>
  )
}

export function LocationModal({ open, onClose }) {
  return (
    <Modal open={open} onClose={onClose} title="Your location" description="Where should we deliver your order?">
      {/* Mounted only while open so each visit starts from the saved location */}
      {open && <LocationForm onDone={onClose} />}
    </Modal>
  )
}

export default function LocationPicker() {
  const { deliveryAddress } = useCart()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group flex max-w-full items-start gap-3 rounded-xl text-left"
      >
        <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400">
          <MapPin className="size-5" aria-hidden />
        </span>
        <span className="min-w-0">
          <span className="block text-xs font-medium tracking-wide text-stone-500 uppercase dark:text-stone-400">
            Deliver now
          </span>
          <span
            className={`flex items-center gap-1 font-semibold group-hover:text-brand-700 dark:group-hover:text-brand-400 ${
              deliveryAddress ? 'text-stone-900 dark:text-stone-100' : 'text-brand-700 dark:text-brand-400'
            }`}
          >
            <span className="line-clamp-2">{deliveryAddress || 'Set your delivery location'}</span>
            <ChevronDown className="size-4 shrink-0" aria-hidden />
          </span>
        </span>
      </button>

      <LocationModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
