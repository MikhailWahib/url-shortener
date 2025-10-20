import { db } from "../db/db"
import bcrypt from "bcrypt"

export const insertUser = async (username: string, password: string) => {
    try {
        // Check for existing user
        const exitingUser = await db.query("SELECT * FROM users WHERE username = $1", [username])

        if (exitingUser && exitingUser.length > 0) {
            return {
                result: null,
                isUsernameTaken: true,
            }
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Insert new user
        const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`
        const result = await db.query(query, [username, hashedPassword])

        if (!result || result.length === 0) {
            throw new Error("Failed to insert user")
        }

        return {
            result,
            isUsernameTaken: false,
        }
    } catch (error) {
        console.error("Error in insertUser:", error)
        throw error
    }
}

export const findUserByUsername = async (username: string) => {
    try {
        if (!username) {
            throw new Error("Username is required")
        }
        const query = `SELECT * FROM users WHERE username = $1;`
        return await db.query(query, [username])
    } catch (error) {
        console.error("Error in findUserByUsername:", error)
        throw error
    }
}

export const findUserUrls = async (userId: number | undefined) => {
    try {
        if (!userId) {
            throw new Error("User ID is required")
        }
        const query = `SELECT id, original_url AS "originalUrl", short_url AS "shortUrl", clicks FROM urls WHERE user_id = $1 ORDER BY id DESC;`
        return await db.query(query, [userId])
    } catch (error) {
        console.error("Error in findUserUrls:", error)
        throw error
    }
}


