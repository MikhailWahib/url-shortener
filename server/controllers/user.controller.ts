import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { signToken } from "../utils/auth"
import { findUserByUsername, findUserUrls, insertUser, User } from "../repositories/user.repository"
import { BASE_URL } from "../constants"
import bcrypt from "bcrypt"


export const handleRegister = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { username, password } = req.body

		const usernameExists = await findUserByUsername(username)
		if (usernameExists) {
			return res.status(409).json({ error: "Username already taken" })
		}

		const user = await insertUser(username, password)
		if (!user) {
			return res.status(500).json({ error: "Failed to create user" })
		}

		const { password: _, ...rest } = user

		res.status(201).json({
			message: "User created successfully",
			user: rest
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const handleLogin = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { username, password } = req.body

		const user = await findUserByUsername(username)
		if (!user) {
			return res.status(401).json({ error: "Invalid credentials" })
		}

		const hashedPassword = user.password
		const isPasswordValid = await bcrypt.compare(password, hashedPassword)
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" })
		}

		const { password: _, ...rest } = user

		// Generate JWT token and send it to the client's cookie
		signToken(rest, res)
		res.status(200).json(rest)
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const handleLogout = async (req: Request, res: Response) => {
	try {
		res.clearCookie("jwt")
		res.status(200).json({ message: "Logged out successfully" })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to logout" })
	}
}

export const getUserUrls = async (req: Request, res: Response) => {
	try {
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { userId } = req
		if (!userId) {
			return res.status(401).json({ error: "Unauthorized" })
		}

		const urls = await findUserUrls(userId)
		if (!urls) {
			return res.status(500).json({ error: "Something went wrong" })
		}

		const modifiedUrls = urls.map((url: Record<string, any>) => ({
			id: url.id,
			originalUrl: url.originalUrl,
			shortUrl: `${BASE_URL}/s/${url.shortUrl}`,
			clicks: url.clicks,
		}))

		res.status(200).json({ urls: modifiedUrls })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch URLs" })
	}
}
