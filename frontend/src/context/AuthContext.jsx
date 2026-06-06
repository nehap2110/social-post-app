// src/context/AuthContext.jsx
// ─────────────────────────────────────────────
//  Authentication Context
//   • Persists session across page refreshes
//   • Validates stored token via /auth/me on load
//   • Provides login, signup, logout to all children
// ─────────────────────────────────────────────

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/authApi'
import { saveToken, getToken, saveUser, getUser, clearSession } from '../utils/token'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)   // true while validating stored token

  // ── Restore session on app load ────────────────
  useEffect(() => {
    const restoreSession = async () => {
      const token = getToken()
      const cached = getUser()

      if (!token) { setLoading(false); return }

      // Optimistically set the cached user so UI doesn't flicker
      if (cached) setUser(cached)

      try {
        // Validate token with server
        const { data } = await authApi.getMe()
        setUser(data.user)
        saveUser(data.user)
      } catch {
        // Token is invalid or expired
        clearSession()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    restoreSession()
  }, [])

  // ── Login ──────────────────────────────────────
  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password })
    saveToken(data.token)
    saveUser(data.user)
    setUser(data.user)
    return data
  }, [])

  // ── Signup ─────────────────────────────────────
  const signup = useCallback(async (username, email, password) => {
    const { data } = await authApi.signup({ username, email, password })
    saveToken(data.token)
    saveUser(data.user)
    setUser(data.user)
    return data
  }, [])

  // ── Logout ─────────────────────────────────────
  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}