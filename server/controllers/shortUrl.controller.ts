import { Request, Response } from "express"
import { createUrl } from "../repositories/url.repository"
import { validationResult } from "express-validator"
import { BASE_URL } from "../constants"

export const handleShortenUrl = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { url }: { url: string } = req.body
		const shortUrlCode = Math.random().toString(36).slice(2, 8)
		const shortUrl = `${BASE_URL}/s/${shortUrlCode}`
		const insertedOriginalUrl = url.startsWith("https://") ? url : `https://${url}`

		const result = await createUrl(
			insertedOriginalUrl,
			req.userId!,
			shortUrlCode
		)

		if (!result || result.length === 0) {
			return res.status(500).json({ error: "Failed to create short URL" })
		}

		res.status(201).json({
			id: result[0].id,
			shortUrl: shortUrl,
			originalUrl: result[0].original_url,
			clicks: result[0].clicks,
		})
	} catch (error) {
		console.error(error)
	}
}
