import { Outlet } from "@tanstack/react-router"
import { ToastContainer } from "react-toastify"

import Header from "@/components/Header"

export default function App() {
  return (
    <>
      <Header />
      <Outlet />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}
