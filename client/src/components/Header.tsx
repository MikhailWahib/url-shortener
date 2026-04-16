import { useNavigate } from "@tanstack/react-router"

import { useAuth } from "@/context/auth"

import { LogoutIcon, UrlIcon } from "./icons"

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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-sky-400 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-950/30 transition duration-300 hover:-rotate-3 hover:scale-105">
            <UrlIcon className="h-7 w-7" />
          </div>
          <div>
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-sky-200/70">Workspace</p>
            <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">URL Shortener</h1>
          </div>
        </div>
        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-2xl border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:-translate-y-0.5 hover:bg-rose-400/15 hover:text-white"
          >
            <LogoutIcon className="h-4.5 w-4.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : null}
      </div>
    </header>
  )
}
