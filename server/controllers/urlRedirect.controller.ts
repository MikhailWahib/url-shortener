import { Request, Response } from "express"
import { getOriginalUrlByCode, incrementClicks } from "../repositories/url.repository"

export const handleRedirect = async (req: Request, res: Response) => {
	try {
		const { shortUrl } = req.params
		const original_url = await getOriginalUrlByCode(shortUrl)

		if (!original_url) {
			return res.status(404).json({ error: "Short URL not found" })
		}

		res.redirect(original_url)
		await incrementClicks(shortUrl)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to process redirect" })
	}
}
