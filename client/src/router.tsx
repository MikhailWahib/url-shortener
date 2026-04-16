import { createRootRouteWithContext, createRoute, createRouter, redirect } from "@tanstack/react-router"

import App from "@/App"
import type { AuthContextType } from "@/context/auth"
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
