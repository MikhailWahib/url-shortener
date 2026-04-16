import { useState } from "react"
import { toast } from "react-toastify"
import { useNavigate } from "@tanstack/react-router"

import { ArrowRightIcon } from "@/components/icons"
import { useAuth } from "@/context/auth"
import type { Url } from "@/types"

type UrlFormProps = {
  onSubmit: (url: Url) => void
}

const submitButtonClassName =
  "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-950/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 md:w-auto"

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
    <form className="mb-8 w-full" onSubmit={handleSubmit}>
      <div className="flex w-full flex-col gap-3 rounded-[28px] border border-white/20 bg-white/12 p-3 shadow-2xl shadow-slate-950/25 backdrop-blur-xl md:flex-row">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter your long URL here..."
          className="min-h-12 flex-1 rounded-2xl border border-transparent bg-white/95 px-5 py-4 text-sm font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-4 focus:ring-sky-200/50"
        />
        <button type="submit" className={submitButtonClassName}>
          Shorten URL
          <ArrowRightIcon className="h-[18px] w-[18px] transition duration-200 group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}
