import { createContext, useContext, useState } from "react"

import type { User } from "@/types"

export type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function getStoredUser(): User | null {
  const raw = localStorage.getItem("user")
  if (!raw) return null

  try {
    return JSON.parse(raw) as User
  } catch {
    localStorage.removeItem("user")
    return null
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => getStoredUser())

  const setUser = (nextUser: User | null) => {
    setUserState(nextUser)
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser))
      return
    }
    localStorage.removeItem("user")
  }


  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider")
  }
  return context
}
