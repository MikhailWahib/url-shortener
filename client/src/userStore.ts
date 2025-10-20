import { reactive } from "vue"


interface IUserStore {
	user: {
		id: number
		username: string
	} | null
}

const user = JSON.parse(localStorage.getItem("user")!)

export const userStore = reactive<IUserStore>({
	user: user,
})
