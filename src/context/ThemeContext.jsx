import { createContext, use, useCallback, useState } from 'react'

const ThemeContext = createContext(null)
const KEY = 'gusto-theme'

export function ThemeProvider({ children }) {
  // index.html sets the class before first paint, so read it from the document
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )

  const toggleTheme = useCallback(() => {
    setIsDarkMode((current) => {
      const next = !current
      document.documentElement.classList.toggle('dark', next)
      try {
        localStorage.setItem(KEY, next ? 'dark' : 'light')
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return <ThemeContext value={{ isDarkMode, toggleTheme }}>{children}</ThemeContext>
}

export const useTheme = () => use(ThemeContext)
