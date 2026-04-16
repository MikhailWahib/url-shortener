import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import { z } from "zod"

import { ArrowRightIcon, LockIcon, UserIcon } from "@/components/icons"
import { useZodForm } from "@/hooks/useZodForm"
import Spinner from "@/components/Spinner"

type SignupResponse = {
  message?: string
  error?: string
}

const signupSchema = z
  .object({
    username: z.string().min(6, "Username must be at least 6 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm Password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  })

const primaryButtonClassName =
  "group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-400 via-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-950/30 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-950/40 disabled:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"

export default function SignupView() {
  const [isLoading, setIsLoading] = useState(false)
  const [resError, setResError] = useState<string | undefined>()

  const { values, errors, touched, handleChange, handleBlur, validate } = useZodForm(signupSchema)

  const navigate = useNavigate()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setResError(undefined)

    if (!validate()) return

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
            <UserIcon className="h-8 w-8 text-white" />
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
              <UserIcon className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
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
              <LockIcon className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
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
              <LockIcon className="ml-4 h-5 w-5 shrink-0 text-slate-400" />
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
            <ArrowRightIcon className="h-4 w-4 transition duration-200 group-hover:translate-x-1" />
          </Link>
        </p>
      </div>
    </main>
  )
}