import { Router } from "express"
import { handleShortenUrl } from "../controllers/shortUrlController"
import { urlValidation } from "../validators/urls"
import { protect } from "../middlewares/protect"

const router = Router()

router.post("/shorten", urlValidation, protect, handleShortenUrl)

export default router


