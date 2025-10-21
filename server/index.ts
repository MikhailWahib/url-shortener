import express, { Router, Request, Response } from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import morgan from "morgan"

import routes from "./routes"
import { handleRedirect } from "./controllers/urlRedirectController"

dotenv.config()

const app = express()
const port = Number(process.env.PORT) || 3000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
	cors({
		origin: process.env.CLIENT_URL,
		credentials: true,
	})
)
app.use(cookieParser())
app.use(morgan("common"))

// routes
app.get("/", (req: Request, res: Response) => {
	res.send(
		"Visit the API Repository for the documentation: https://github.com/MikhaiWahib/url-shortener-backend"
	)
})
app.use("/api/v1", routes)
app.get("/s/:shortUrl", handleRedirect)

	; (async () => {
		try {
			app.listen(port, () => {
				console.log(`Server running on port ${port}`)
			})
		} catch (error) {
			console.error(error)
		}
	})()

export default app
