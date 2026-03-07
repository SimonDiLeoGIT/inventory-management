import { createContext } from 'react'

export interface User {
  id: number
  username: string
  email: string
  roles: string[]
}

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  user: User | null
  loading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)