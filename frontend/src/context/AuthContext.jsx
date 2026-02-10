import { createContext, useContext, useEffect, useState } from 'react'
import { getProfile } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function check() {
      try {
        const me = await getProfile()
        setIsAuthenticated(!!me?.email)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setChecking(false)
      }
    }
    check()
  }, [])

  const value = { isAuthenticated, setIsAuthenticated, checking }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
