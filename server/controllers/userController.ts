import { Request, Response } from "express"
import { validationResult } from "express-validator"
import { signToken } from "../utils/auth"
import { findUserByUsername, findUserUrls, insertUser } from "../repositories/users"
import { User } from "../types"
import bcrypt from "bcrypt"

export const handleRegister = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const { result, isUsernameTaken } = await insertUser(username, password)

		if (isUsernameTaken) {
			return res.status(400).json({ error: "Username already taken" })
		}

		if (!result || result.length === 0) {
			return res.status(500).json({ error: "Failed to create user" })
		}

		const newUser: User = {
			id: result[0].id,
			username: result[0].username
		}

		res.status(201).json({
			message: "User created successfully",
			user: newUser
		})
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Internal server error" })
	}
}

export const handleLogin = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body

		const errors = validationResult(req)
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() })
		}

		const result = await findUserByUsername(username)
		if (!result || result.length === 0) {
			return res.status(401).json({ error: "Invalid credentials" })
		}

		const hashedPassword = result[0].password
		const isPasswordValid = await bcrypt.compare(password, hashedPassword)
		if (!isPasswordValid) {
			return res.status(401).json({ error: "Invalid credentials" })
		}

		const user: User = {
			id: result[0].id,
			username: result[0].username
		}

		// Generate JWT token and send it to the client's cookie
		signToken(user, res)
		res.status(200).json(user)
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
		const result = await findUserUrls(req.userId)

		const modifiedUrls = result.map((url: Record<string, any>) => ({
			id: url.id,
			originalUrl: url.originalUrl,
			shortUrl: `${req.protocol}://${req.get("host")}/s/${url.shortUrl}`,
			clicks: url.clicks,
		}))

		res.status(200).json({ urls: modifiedUrls })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: "Failed to fetch URLs" })
	}
}
