import { BRAND_LABEL, cardBrand, digitsOnly } from '../lib/card'

// Front shows number, holder and expiry; flips to the back while the CVV is focused
export default function CreditCardPreview({ number, expiry, holder, cvv, showBack }) {
  const brand = cardBrand(number)
  const digits = digitsOnly(number)
  const display = (brand === 'amex' ? '#### ###### #####' : '#### #### #### ####')
    .split('')
    .reduce(
      (acc, char) => {
        if (char === '#') {
          acc.out += digits[acc.i] ?? '•'
          acc.i += 1
        } else acc.out += char
        return acc
      },
      { out: '', i: 0 },
    ).out

  const face =
    'absolute inset-0 rounded-2xl p-5 text-white shadow-xl [backface-visibility:hidden] sm:p-6 bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 ring-1 ring-white/10'

  return (
    <div className="mx-auto w-full max-w-sm [perspective:1200px]" aria-hidden>
      <div
        className={`relative aspect-[1.586] transition-transform duration-500 [transform-style:preserve-3d] ${
          showBack ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        <div className={`${face} flex flex-col`}>
          <div className="flex items-start justify-between">
            <span className="h-8 w-11 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 opacity-90" />
            <span className="text-lg font-bold tracking-wide italic">{brand ? BRAND_LABEL[brand] : ''}</span>
          </div>
          <p className="mt-auto font-mono text-lg tracking-widest sm:text-xl">{display}</p>
          <div className="mt-4 flex items-end justify-between gap-4 text-xs">
            <div className="min-w-0">
              <p className="text-white/50 uppercase">Card holder</p>
              <p className="mt-0.5 truncate text-sm font-medium tracking-wide uppercase">{holder || 'Your name'}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-white/50 uppercase">Expires</p>
              <p className="mt-0.5 font-mono text-sm">{expiry || 'MM/YY'}</p>
            </div>
          </div>
        </div>

        <div className={`${face} [transform:rotateY(180deg)] px-0 sm:px-0`}>
          <div className="mt-3 h-11 bg-black/80" />
          <div className="mt-5 flex items-center gap-3 px-5 sm:px-6">
            <div className="h-9 flex-1 rounded bg-white/80" />
            <div className="grid h-9 w-16 place-items-center rounded bg-white font-mono text-stone-900">
              {cvv ? '•'.repeat(cvv.length) : 'CVV'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
