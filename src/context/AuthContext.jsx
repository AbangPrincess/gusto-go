import { createContext, use, useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined) // undefined = still checking

  useEffect(() => onAuthStateChanged(auth, (next) => setUser(next ?? null)), [])

  return <AuthContext value={{ user, loading: user === undefined }}>{children}</AuthContext>
}

export const useAuth = () => use(AuthContext)
