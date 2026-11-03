// Card helpers for the checkout form. Card details only live in component
// state: they are never stored, logged or sent anywhere.

export const digitsOnly = (value) => value.replace(/\D/g, '')

export function cardBrand(number) {
  const n = digitsOnly(number)
  if (/^4/.test(n)) return 'visa'
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard'
  if (/^3[47]/.test(n)) return 'amex'
  if (/^(6011|65|64[4-9])/.test(n)) return 'discover'
  return null
}

export const BRAND_LABEL = { visa: 'VISA', mastercard: 'Mastercard', amex: 'AMEX', discover: 'Discover' }

export function formatCardNumber(value) {
  const n = digitsOnly(value)
  if (cardBrand(n) === 'amex') {
    const d = n.slice(0, 15)
    return [d.slice(0, 4), d.slice(4, 10), d.slice(10)].filter(Boolean).join(' ')
  }
  return n.slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value) {
  const n = digitsOnly(value).slice(0, 4)
  return n.length > 2 ? `${n.slice(0, 2)}/${n.slice(2)}` : n
}

export const maskCardNumber = (value) => {
  const n = digitsOnly(value)
  return n.length >= 4 ? `•••• ${n.slice(-4)}` : ''
}

export function validateCard({ number, expiry, holder, cvv }) {
  const errors = {}
  const n = digitsOnly(number)
  const brand = cardBrand(n)
  const minLength = brand === 'amex' ? 15 : 16
  if (n.length < minLength) errors.number = 'Please input a valid number.'

  const match = /^(\d{2})\/(\d{2})$/.exec(expiry)
  if (!match) {
    errors.expiry = 'Please input a valid date (MM/YY).'
  } else {
    const month = Number(match[1])
    const year = 2000 + Number(match[2])
    const now = new Date()
    const expired = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)
    if (month < 1 || month > 12) errors.expiry = 'Please input a valid month.'
    else if (expired) errors.expiry = 'This card has expired.'
  }

  if (!holder.trim()) errors.holder = 'Please input the card holder name.'

  const cvvLength = brand === 'amex' ? 4 : 3
  if (digitsOnly(cvv).length < cvvLength) errors.cvv = 'Please input a valid CVV.'

  return errors
}
