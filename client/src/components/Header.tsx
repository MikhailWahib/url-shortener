import { useNavigate } from "@tanstack/react-router"

import { useAuth } from "@/context/auth"

import UrlIcon from "./icons/UrlIcon"
import "./Header.css"

export default function Header() {
  const navigate = useNavigate()
  const { user, setUser } = useAuth()

  const handleLogout = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL
      const response = await fetch(`${apiUrl}/api/v1/users/logout`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        setUser(null)
        navigate({ to: "/login" })
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <div className="logo-icon">
            <UrlIcon size={28} />
          </div>
          <h1 className="logo-title">URL Shortener</h1>
        </div>
        {user ? (
          <button type="button" onClick={handleLogout} className="logout-btn">
            <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span>Logout</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}
