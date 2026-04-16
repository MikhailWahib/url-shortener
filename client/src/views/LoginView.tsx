import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import * as Yup from "yup"

import Spinner from "@/components/Spinner"
import { useAuth } from "@/context/auth"

import "./LoginView.css"

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

  return (
    <main className="login-view">
      <div className="login-container">
        <div className="header-section">
          <div className="icon-wrapper">
            <svg className="lock-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className={`input-wrapper ${errors.username && usernameTouched ? "error" : ""} ${!errors.username && usernameTouched ? "success" : ""}`}>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              />
              {usernameTouched ? (
                <div className="validation-icon">
                  {errors.username ? (
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  ) : (
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ) : null}
            </div>
            {usernameTouched && errors.username ? <div className="error-msg">{errors.username}</div> : null}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className={`input-wrapper ${errors.password && passwordTouched ? "error" : ""} ${!errors.password && passwordTouched ? "success" : ""}`}>
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              />
              {passwordTouched ? (
                <div className="validation-icon">
                  {errors.password ? (
                    <svg className="error-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M15 9l-6 6M9 9l6 6" />
                    </svg>
                  ) : (
                    <svg className="success-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ) : null}
            </div>
            {passwordTouched && errors.password ? <div className="error-msg">{errors.password}</div> : null}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {!isLoading ? <span>Sign In</span> : <Spinner />}
          </button>

          {resError ? <div className="error-msg response-error">{resError}</div> : null}
        </form>

        <div className="divider">
          <span>New to our platform?</span>
        </div>

        <p className="signup-text">
          <Link to="/signup" className="signup-link">
            Create an account
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </p>
      </div>
    </main>
  )
}
