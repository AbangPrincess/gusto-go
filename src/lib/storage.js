// localStorage can be unavailable (private mode, blocked storage), so never let it throw
export const readJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const writeJSON = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

export const removeKey = (key) => {
  try {
    localStorage.removeItem(key)
  } catch {
    // ignore
  }
}
