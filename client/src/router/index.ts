import { createRouter, createWebHistory } from "vue-router"
import HomeView from "../views/HomeView.vue"
import LoginView from "../views/LoginView.vue"
import SignupView from "../views/SignupView.vue"
import { userStore } from "@/userStore"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: HomeView,
		},
		{
			path: "/login",
			name: "login",
			component: LoginView,
		},
		{
			path: "/signup",
			name: "signup",
			component: SignupView,
		},
	],
})

router.beforeEach((to, _from, next) => {
	if (to.name === "login" && userStore.user) {
		next({ name: "home" })
	} else if (to.name === "signup" && userStore.user) {
		next({ name: "home" })
	} else if (to.name === "home" && !userStore.user) {
		next({ name: "login" })
	} else {
		next()
	}
})

export default router
