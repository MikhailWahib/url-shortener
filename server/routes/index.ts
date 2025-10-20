import { Router, Request, Response } from "express"
import userRoutes from "./users"
import urlsRoutes from "./urls"
import { protect } from "../middlewares/protect"

const router = Router()

router.use("/users", userRoutes)
router.use("/", urlsRoutes)

router.get("/", protect, async (req: Request, res: Response) => {
	res.send("Hello World!")
})

export default router
