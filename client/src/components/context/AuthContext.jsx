// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user,    setUser]    = useState(() => {
    try { return JSON.parse(localStorage.getItem('cl_user')) } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  // Register
  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/register', { name, email, password })
      localStorage.setItem('cl_token', data.token)
      localStorage.setItem('cl_user',  JSON.stringify(data.user))
      setUser(data.user)
      toast.success(`Welcome, ${data.user.name}! 🎉`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally { setLoading(false) }
  }

  // Login
  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      localStorage.setItem('cl_token', data.token)
      localStorage.setItem('cl_user',  JSON.stringify(data.user))
      setUser(data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      return { success: true }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed'
      toast.error(msg)
      return { success: false, message: msg }
    } finally { setLoading(false) }
  }

  // Logout
  const logout = () => {
    localStorage.removeItem('cl_token')
    localStorage.removeItem('cl_user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
