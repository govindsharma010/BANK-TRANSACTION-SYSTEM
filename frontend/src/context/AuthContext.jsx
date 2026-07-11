import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import * as authApi from '../api/auth.api'
import {
  getToken,
  setToken,
  clearAuthStorage,
  getStoredUser,
  setStoredUser,
} from '../utils/authStorage'
import { getErrorMessage } from '../utils/helpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)
  const [loading, setLoading] = useState(true)

  const bootstrap = useCallback(async () => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const data = await authApi.getMe()
      setUser(data.user)
      setStoredUser(data.user)
    } catch {
      clearAuthStorage()
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrap()
  }, [bootstrap])

  const login = async (credentials) => {
    const data = await authApi.login(credentials)
    setToken(data.token)
    setStoredUser(data.user)
    setUser(data.user)
    return data
  }

  const register = async (payload) => {
    const data = await authApi.register(payload)
    setToken(data.token)
    setStoredUser(data.user)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.error(getErrorMessage(error, 'Logout failed'))
    } finally {
      clearAuthStorage()
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, bootstrap }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
