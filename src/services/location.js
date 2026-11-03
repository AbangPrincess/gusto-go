// Delivery location helpers built on OpenStreetMap data.
// Reverse geocoding: Nominatim (one request per tap). Address search: Photon (made for search-as-you-type).
// Coordinates are only sent when the customer taps "Use my current location" or searches for an address.

const PH_BBOX = '116.9,4.5,126.7,21.2' // Philippines

const LOCATION_ERRORS = {
  1: 'Location access is turned off. Allow it in your browser or phone settings, or search for your address.',
  2: 'We couldn’t detect your location. Move to an open area or search for your address.',
  3: 'Finding your location took too long. Try again or search for your address.',
}

export function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(new Error('This device can’t share its location. Search for your address instead.'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        resolve({ lat: coords.latitude, lng: coords.longitude, accuracy: Math.round(coords.accuracy) }),
      (error) => reject(new Error(LOCATION_ERRORS[error.code] ?? LOCATION_ERRORS[2])),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    )
  })
}

const joinParts = (parts) => [...new Set(parts.filter(Boolean))].join(', ')

export async function reverseGeocode({ lat, lng }) {
  const url =
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18` +
    `&accept-language=en&lat=${lat}&lon=${lng}`
  const response = await fetch(url)
  if (!response.ok) throw new Error('lookup failed')
  const { address = {}, display_name: fallback } = await response.json()
  const street = joinParts([address.house_number, address.road]).replace(', ', ' ')
  return (
    joinParts([
      street || address.amenity || address.building,
      address.neighbourhood || address.quarter || address.village || address.hamlet,
      address.suburb,
      address.city || address.town || address.municipality,
      address.state || address.province,
    ]) || fallback
  )
}

const photonLabel = ({ name, housenumber, street, locality, district, city, county, state }) => {
  const streetLine = street ? joinParts([housenumber, street]).replace(', ', ' ') : null
  return joinParts([name !== street ? name : null, streetLine, locality, district, city || county, state])
}

export async function searchAddresses(query, { near, signal } = {}) {
  const params = new URLSearchParams({ q: query, limit: '6', lang: 'en', bbox: PH_BBOX })
  if (near) {
    params.set('lat', near.lat)
    params.set('lon', near.lng)
  }
  const response = await fetch(`https://photon.komoot.io/api/?${params}`, { signal })
  if (!response.ok) throw new Error('search failed')
  const { features = [] } = await response.json()
  const seen = new Set()
  return features.flatMap(({ properties, geometry }) => {
    const label = photonLabel(properties)
    if (!label || seen.has(label)) return []
    seen.add(label)
    const [lng, lat] = geometry.coordinates
    return [{ label, lat, lng }]
  })
}

// OpenStreetMap embed centred on the pin
export const mapEmbedUrl = ({ lat, lng }, zoom = 0.004) =>
  `https://www.openstreetmap.org/export/embed.html?bbox=${lng - zoom},${lat - zoom / 1.6},${lng + zoom},${lat + zoom / 1.6}` +
  `&layer=mapnik&marker=${lat},${lng}`

export const mapLinkUrl = ({ lat, lng }) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`
