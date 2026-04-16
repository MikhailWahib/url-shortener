import "./assets/main.css"
import "react-toastify/dist/ReactToastify.css"

import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "@tanstack/react-router"
import { Analytics } from "@vercel/analytics/react"

import { AuthProvider, useAuth } from "./context/auth"
import { router } from "./router"

function AppRouter() {
  const auth = useAuth()
  return <RouterProvider router={router} context={{ auth }} />
}

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
    <Analytics />
  </React.StrictMode >,
)
