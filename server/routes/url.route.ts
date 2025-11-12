import { Router } from "express"
import { handleShortenUrl } from "../controllers/shortUrl.controller"
import { urlValidation } from "../validators/url.validator"
import { protect } from "../middlewares/protect"

const router = Router()

router.post("/shorten", urlValidation, protect, handleShortenUrl)

export default router


