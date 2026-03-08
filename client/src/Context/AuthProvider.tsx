import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext, type User } from './AuthContext'
import axios from 'axios'

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {

      const token = localStorage.getItem("token")

      if (!token) {
        setLoading(false)
        return
      }

      try {

        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}auth/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setUser(response.data.user)
        setIsAuthenticated(true)
      } catch {

        console.error("Token inválido o expirado")
        localStorage.removeItem("token")
        setIsAuthenticated(false)

      } finally {
        setLoading(false)
      }
    }

    checkAuth()

  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}auth/login`,
        { email, password }
      )

      if (response.data.success) {
        setIsAuthenticated(true)

        localStorage.setItem("token", response.data.token)

        setUser(response.data.user)

        return true
      }

      return false

    } catch (error: any) {

      if (error.response?.status === 401) {
        return false
      }

      throw error
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    // localStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        login, 
        logout,
        user,
        loading
      }}>
      {children}
    </AuthContext.Provider>
  )
}