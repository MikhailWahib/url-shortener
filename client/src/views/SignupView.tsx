import { useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { toast } from "react-toastify"
import * as Yup from "yup"

import Spinner from "@/components/Spinner"

import "./SignupView.css"

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
    <main className="signup-view">
      <div className="signup-container">
        <div className="header-section">
          <div className="icon-wrapper">
            <svg className="user-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <h2>Create Account</h2>
          <p className="subtitle">Join us to start shortening URLs</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
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
                placeholder="Choose a username"
              />
            </div>
            {touched.username ? <div className="error-msg">{errors.username}</div> : null}
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
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
                placeholder="Create a password"
              />
            </div>
            {touched.password ? <div className="error-msg">{errors.password}</div> : null}
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              />
            </div>
            {touched.confirmPassword ? <div className="error-msg">{errors.confirmPassword}</div> : null}
          </div>

          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {!isLoading ? <span>Create Account</span> : <Spinner />}
          </button>

          {resError ? <div className="error-msg response-error">{resError}</div> : null}
        </form>

        <div className="divider">
          <span>Already have an account?</span>
        </div>

        <p className="login-text">
          <Link to="/login" className="login-link">
            Sign in here
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </p>
      </div>
    </main>
  )
}
