// Money in Philippine peso, e.g. ₱60.00
export const formatPrice = (value) => `₱${Number(value).toFixed(2)}`

const pad = (n) => String(n).padStart(2, '0')

// yyyy-MM-dd HH:mm:ss
export const formatDateTime = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
  `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`

export const formatTime = (date) =>
  date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })

export const formatAddons = (addons) =>
  addons.map((addon) => `${addon.name} (${formatPrice(addon.price)})`).join(', ')

export const lineUnitPrice = (item) =>
  item.food.price + item.addons.reduce((sum, addon) => sum + addon.price, 0)

export const lineTotal = (item) => lineUnitPrice(item) * item.quantity
