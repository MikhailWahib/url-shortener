import "./assets/main.css"

import { createApp } from "vue"
import App from "./App.vue"
import router from "./router"

import Toast, { POSITION, type PluginOptions } from "vue-toastification"
import "vue-toastification/dist/index.css"

const options: PluginOptions = {
  position: POSITION.TOP_RIGHT,
  timeout: 3000
}

const app = createApp(App)

app.use(router)
app.use(Toast, options)

app.mount("#app")
