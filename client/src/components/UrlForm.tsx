import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "@tanstack/react-router"

import { useAuth } from "@/context/auth"
import type { Url } from "@/types"

import "./UrlForm.css"

type UrlFormProps = {
  onSubmit: (url: Url) => void
}

export default function UrlForm({ onSubmit }: UrlFormProps) {
  const [input, setInput] = useState("")
  const navigate = useNavigate()
  const { setUser } = useAuth()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const apiUrl = import.meta.env.VITE_API_URL

    try {
      const response = await fetch(`${apiUrl}/api/v1/shorten`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: input }),
      })

      const data = (await response.json()) as Url

      if (response.ok) {
        toast.success("URL shortened successfully!")
        onSubmit(data)
        setInput("")
      } else if (response.status === 401) {
        setUser(null)
        navigate({ to: "/login" })
        toast.error("Session expired, please login again")
      } else {
        console.log(data)
        toast.error("Please enter a valid URL")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <form className="url-form" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter your long URL here..."
        />
        <button type="submit" className="btn btn-primary">
          Shorten URL
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </form>
  )
}
