import { ExternalLink } from 'lucide-react'
import { mapEmbedUrl, mapLinkUrl } from '../services/location'

export default function LocationMap({ coords, className = 'h-44' }) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-stone-200 dark:ring-stone-800">
      <iframe
        title="Delivery location map"
        src={mapEmbedUrl(coords)}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className={`block w-full border-0 ${className}`}
      />
      <a
        href={mapLinkUrl(coords)}
        target="_blank"
        rel="noreferrer"
        className="flex items-center justify-end bg-stone-50 px-3 py-2 text-xs text-stone-500 hover:text-stone-800 dark:bg-stone-800/60 dark:text-stone-400 dark:hover:text-stone-200"
      >
        <span className="inline-flex items-center gap-1 font-medium">
          Open larger map <ExternalLink className="size-3" aria-hidden />
        </span>
      </a>
    </div>
  )
}
