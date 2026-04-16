import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import * as Yup from "yup"

import Spinner from "@/components/Spinner"

type SignupValues = {
  username: string
  password: string
  confirmPassword: string
}

type SignupResponse = {
  message?: string
  error?: string
}

const schema = Yup.object({
  username: Yup.string().required("Username is required").min(6, "Username must be at least 6 characters"),
  password: Yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
})

const primaryButtonClassName =
  "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-950/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"

export default function SignupView() {
  const [values, setValues] = useState<SignupValues>({ username: "", password: "", confirmPassword: "" })
  const [touched, setTouched] = useState<Record<keyof SignupValues, boolean>>({
    username: false,
    password: false,
    confirmPassword: false,
  })
  const [errors, setErrors] = useState<Partial<Record<keyof SignupValues, string>>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [resError, setResError] = useState<string | undefined>()

  const navigate = useNavigate()

  const validateField = async (field: keyof SignupValues, value: string) => {
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

  const handleChange = (field: keyof SignupValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (touched[field]) {
      void validateField(field, value)
    }
    if (field === "password" && touched.confirmPassword) {
      void validateField("confirmPassword", values.confirmPassword)
    }
  }

  const handleBlur = (field: keyof SignupValues) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    void validateField(field, values[field])
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setTouched({ username: true, password: true, confirmPassword: true })
    setResError(undefined)

    try {
      await schema.validate(values, { abortEarly: false })
      setErrors({})
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const nextErrors: Partial<Record<keyof SignupValues, string>> = {}
        error.inner.forEach((item) => {
          if (item.path) {
            nextErrors[item.path as keyof SignupValues] = item.message
          }
        })
        setErrors(nextErrors)
        return
      }
    }

    setIsLoading(true)
    const apiUrl = import.meta.env.VITE_API_URL

    try {
      const response = await fetch(`${apiUrl}/api/v1/users`, {
        method: "POST",
        credentials: "include",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      const data = (await response.json()) as SignupResponse

      if (response.status === 201) {
        toast.success("User created successfully")
        navigate({ to: "/login" })
      } else {
        setResError(data.error)
      }
    } finally {
      setIsLoading(false)
    }
  }

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
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.34em] text-sky-100/70">New Account</p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Create account</h2>
          <p className="mt-3 text-sm text-sky-100/75">Set up your workspace and start publishing cleaner links.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="username" className="ml-1 text-sm font-semibold text-slate-100">
              Username
            </label>
            <div className="flex items-center rounded-2xl border border-white/60 bg-white/90 transition duration-200 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/70">
              <svg className="ml-4 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <input
                id="username"
                type="text"
                value={values.username}
                onChange={(event) => handleChange("username", event.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="Choose a username"
                className="min-h-14 w-full bg-transparent px-3 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            {touched.username && errors.username ? <div className="ml-1 text-sm text-rose-300">{errors.username}</div> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="ml-1 text-sm font-semibold text-slate-100">
              Password
            </label>
            <div className="flex items-center rounded-2xl border border-white/60 bg-white/90 transition duration-200 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/70">
              <svg className="ml-4 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="password"
                type="password"
                value={values.password}
                onChange={(event) => handleChange("password", event.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Create a password"
                className="min-h-14 w-full bg-transparent px-3 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            {touched.password && errors.password ? <div className="ml-1 text-sm text-rose-300">{errors.password}</div> : null}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="ml-1 text-sm font-semibold text-slate-100">
              Confirm Password
            </label>
            <div className="flex items-center rounded-2xl border border-white/60 bg-white/90 transition duration-200 focus-within:border-sky-300 focus-within:ring-4 focus-within:ring-sky-200/70">
              <svg className="ml-4 h-5 w-5 shrink-0 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <input
                id="confirmPassword"
                type="password"
                value={values.confirmPassword}
                onChange={(event) => handleChange("confirmPassword", event.target.value)}
                onBlur={() => handleBlur("confirmPassword")}
                placeholder="Confirm your password"
                className="min-h-14 w-full bg-transparent px-3 pr-4 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
              />
            </div>
            {touched.confirmPassword && errors.confirmPassword ? (
              <div className="ml-1 text-sm text-rose-300">{errors.confirmPassword}</div>
            ) : null}
          </div>

          <button type="submit" className={primaryButtonClassName} disabled={isLoading}>
            {!isLoading ? <span>Create Account</span> : <Spinner />}
          </button>

          {resError ? (
            <div className="rounded-2xl border border-rose-300/30 bg-rose-300/10 px-4 py-3 text-center text-sm text-rose-100">
              {resError}
            </div>
          ) : null}
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <span className="relative bg-slate-900/50 px-4 text-xs uppercase tracking-[0.24em] text-slate-300">
            Already have an account?
          </span>
        </div>

        <p className="text-center">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/6 px-4 py-3 text-sm font-semibold text-sky-100 transition hover:border-sky-300/40 hover:bg-sky-300/10"
          >
            Sign in here
            <svg
              className="h-4 w-4 transition duration-200 group-hover:translate-x-1"
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
