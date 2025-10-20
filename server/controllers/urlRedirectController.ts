import { Request, Response } from "express"
import { findOriginalUrlByCode, incrementClicks } from "../repositories/urls"

export const handleRedirect = async (req: Request, res: Response) => {
	try {
		const { shortUrl } = req.params
		const result = await findOriginalUrlByCode(shortUrl)

		if (!result || result.length === 0) {
			return res.status(404).json({ error: "Short URL not found" })
		}

		res.redirect(result[0].original_url)
		await incrementClicks(shortUrl)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to process redirect" })
	}
}
