import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import * as Yup from "yup"

import Spinner from "@/components/Spinner"
import { useAuth } from "@/context/auth"

type LoginValues = {
  username: string
  password: string
}

type LoginResponse = {
  id?: number
  username?: string
  error?: string
}

const schema = Yup.object({
  username: Yup.string().required("Username is required").min(6, "Username must be at least 6 characters"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
})

const primaryButtonClassName =
  "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-950/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"

function getFieldStyles(hasError: boolean, isValid: boolean) {
  if (hasError) {
    return {
      wrapper: "border-rose-300/80 bg-rose-50/90 focus-within:border-rose-400 focus-within:ring-4 focus-within:ring-rose-200/70",
      icon: "text-rose-400",
      input: "text-rose-950 placeholder:text-rose-300",
    }
  }

  if (isValid) {
    return {
      wrapper: "border-emerald-300/80 bg-emerald-50/90 focus-within:border-emerald-400 focus-within:ring-4 focus-within:ring-emerald-200/70",
      icon: "text-emerald-500",
      input: "text-emerald-950 placeholder:text-emerald-300",
    }
  }

  return {
    wrapper: "border-white/60 bg-white/90 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/70",
    icon: "text-slate-400",
    input: "text-slate-900 placeholder:text-slate-400",
  }
}

export default function LoginView() {
  const [values, setValues] = useState<LoginValues>({ username: "", password: "" })
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({ username: false, password: false })
  const [errors, setErrors] = useState<Partial<Record<keyof LoginValues, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [resError, setResError] = useState<string | undefined>()

  const { setUser } = useAuth()
  const navigate = useNavigate()

  const validateField = async (field: keyof LoginValues, value: string) => {
    try {
      await schema.validateAt(field, { ...values, [field]: value })
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    } catch (error) {
      if (error instanceof Error) {
        const message = error.message
        setErrors((prev) => ({ ...prev, [field]: message }))
      }
    }
  }

  const handleChange = (field: keyof LoginValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      void validateField(field, value)
    }
  }

  const handleBlur = (field: keyof LoginValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    void validateField(field, values[field])
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ username: true, password: true })
    setResError(undefined)

    try {
      await schema.validate(values, { abortEarly: false })
      setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const nextErrors: Partial<Record<keyof LoginValues, string>> = {}
        error.inner.forEach((item) => {
          if (item.path) {
            nextErrors[item.path as keyof LoginValues] = item.message
          }
        })
        setErrors(nextErrors)
        return
      }
    }

    setIsLoading(true)
    const apiUrl = import.meta.env.VITE_API_URL

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/login`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
      const data = (await response.json()) as LoginResponse

      if (response.status === 200 && data.id && data.username) {
        setUser({ id: data.id, username: data.username })
        navigate({ to: "/" })
      } else {
        setResError(data.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const usernameTouched = touched.username
  const passwordTouched = touched.password
  const usernameStyles = getFieldStyles(Boolean(errors.username && usernameTouched), Boolean(!errors.username && usernameTouched))
  const passwordStyles = getFieldStyles(Boolean(errors.password && passwordTouched), Boolean(!errors.password && passwordTouched))

  return (
    <main className="relative isolate flex min-h-[calc(100vh-81px)] items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-16 top-0 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl animate-[float_6s_ease-in-out_infinite]" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-fuchsia-500/12 blur-3xl animate-[float_8s_ease-in-out_infinite]" />
      </div>
      <div className="w-full max-w-md rounded-[32px] border border-white/15 bg-white/10 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur-2xl sm:p-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-[72px] w-[72px] items-center justify-center rounded-[24px] bg-gradient-to-br from-sky-400 via-indigo-500 to-fuchsia-500 shadow-lg shadow-indigo-950/30">
            <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-sky-100/70">Account Access</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome back</h2>
          <p className="mt-3 text-sm text-sky-100/75">Sign in to manage shortened links and recent traffic.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="ml-1 text-sm font-semibold text-slate-100">
              Username
            </label>
            <div
              className={`group flex items-center rounded-2xl border transition duration-200 ${usernameStyles.wrapper}`}
            >
              <svg className={`ml-4 h-5 w-5 shrink-0 transition ${usernameStyles.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                type="text"
                value={values.username}
                onChange={(event) => handleChange("username", event.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="Enter your username"
                className={`min-h-14 w-full bg-transparent pr-4 pl-3 text-sm font-medium outline-none ${usernameStyles.input}`}
              />
              {usernameTouched ? (
                <div className="mr-4 flex h-5 w-5 items-center justify-center">
                  {errors.username ? (
                    <svg className="h-[18px] w-[18px] text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  ) : (
                    <svg className="h-[18px] w-[18px] text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ) : null}
            </div>
            {usernameTouched && errors.username ? <div className="ml-1 text-sm text-rose-300">{errors.username}</div> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="ml-1 text-sm font-semibold text-slate-100">
              Password
            </label>
            <div
              className={`group flex items-center rounded-2xl border transition duration-200 ${passwordStyles.wrapper}`}
            >
              <svg className={`ml-4 h-5 w-5 shrink-0 transition ${passwordStyles.icon}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                value={values.password}
                onChange={(event) => handleChange("password", event.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                className={`min-h-14 w-full bg-transparent pr-4 pl-3 text-sm font-medium outline-none ${passwordStyles.input}`}
              />
              {passwordTouched ? (
                <div className="mr-4 flex h-5 w-5 items-center justify-center">
                  {errors.password ? (
                    <svg className="h-[18px] w-[18px] text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  ) : (
                    <svg className="h-[18px] w-[18px] text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ) : null}
            </div>
            {passwordTouched && errors.password ? <div className="ml-1 text-sm text-rose-300">{errors.password}</div> : null}
          </div>

          <button type="submit" className={primaryButtonClassName} disabled={isLoading}>
            {!isLoading ? <span>Sign In</span> : <Spinner />}
          </button>

          {resError ? (
            <div className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-center text-sm text-rose-100">
              {resError}
            </div>
          ) : null}
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <span className="relative bg-slate-900/50 px-4 text-xs uppercase tracking-[0.24em] text-slate-300">New here?</span>
        </div>

        <p className="text-center">
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-300/10"
          >
            Create an account
            <svg
              className="h-[18px] w-[18px] transition duration-200 group-hover:translate-x-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </p>
      </div>
    </main>
  )
}
