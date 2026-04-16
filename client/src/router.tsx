import { createRootRouteWithContext, createRoute, createRouter, redirect } from "@tanstack/react-router"

import App from "@/App"
import type { AuthContextType } from "@/context/auth"
import type { Url } from "@/types"
import HomeView from "@/views/HomeView"
import LoginView from "@/views/LoginView"
import SignupView from "@/views/SignupView"

const rootRoute = createRootRouteWithContext<{ auth: AuthContextType }>()({
  component: App,
})

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/login" })
    }
  },
  loader: async () => {
    const apiUrl = import.meta.env.VITE_API_URL
    const response = await fetch(`${apiUrl}/api/v1/users/urls`, {
      method: "GET",
      credentials: "include",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (response.status === 401) {
      throw redirect({ to: "/login" })
    }

    const data = (await response.json()) as { urls: Url[] }
    return data.urls
  },
  component: HomeView,
})

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/" })
    }
  },
  component: LoginView,
})

const signupRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/signup",
  beforeLoad: ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/" })
    }
  },
  component: SignupView,
})

const routeTree = rootRoute.addChildren([homeRoute, loginRoute, signupRoute])

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined! as AuthContextType,
  },
})

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}
