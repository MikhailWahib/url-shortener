import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"

import UrlForm from "@/components/UrlForm"
import UrlsList from "@/components/UrlsList"
import { useAuth } from "@/context/auth"
import type { Url } from "@/types"

import "./HomeView.css"

export default function HomeView() {
  const [urls, setUrls] = useState<Url[]>([])
  const navigate = useNavigate()
  const { setUser } = useAuth()

  useEffect(() => {
    const getUrls = async () => {
      const apiUrl = import.meta.env.VITE_API_URL

      try {
        const response = await fetch(`${apiUrl}/api/v1/users/urls`, {
          method: "GET",
          credentials: "include",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        })

        const data = (await response.json()) as { urls: Url[] }

        if (response.status === 401) {
          setUser(null)
          navigate({ to: "/login" })
          return
        }

        setUrls(data.urls)
      } catch (error) {
        console.log(error)
      }
    }

    void getUrls()
  }, [navigate, setUser])

  const handleUrlSubmit = (url: Url) => {
    setUrls((prevUrls) => [url, ...prevUrls])
  }

  return (
    <main className="home-view">
      <div className="home-container">
        <div className="header-section">
          <div className="icon-wrapper">
            <svg className="link-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <h2>Shorten Your URLs</h2>
          <p className="subtitle">Create short, memorable links in seconds</p>
        </div>
        <UrlForm onSubmit={handleUrlSubmit} />
        <UrlsList urls={urls} />
      </div>
    </main>
  )
}
