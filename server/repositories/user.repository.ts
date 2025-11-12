import { db } from "../db/db"
import bcrypt from "bcrypt"
import { Url } from "./url.repository"

export type User = {
    id: number
    username: string
    password: string
}


export const insertUser = async (username: string, password: string): Promise<User | null> => {
    try {
        const hashedPassword = await bcrypt.hash(password, 12)

        const query = `INSERT INTO users (username, password) VALUES ($1, $2) RETURNING *;`
        const rows = await db.query(query, [username, hashedPassword])
        if (!rows || rows.length === 0) {
            return null
        }

        return rows[0] as User
    } catch (error) {
        console.error("Error in insertUser:", error)
        return null
    }
}

export const findUserByUsername = async (username: string): Promise<User | null> => {
    try {
        const query = `SELECT * FROM users WHERE username = $1;`
        const rows = await db.query(query, [username])
        if (!rows || rows.length === 0) {
            return null
        }

        return rows[0] as User
    } catch (error) {
        console.error("Error in findUserByUsername:", error)
        return null
    }
}

export const findUserUrls = async (userId: number): Promise<Url[] | null> => {
    try {
        const query = `SELECT id, original_url AS "originalUrl", short_url AS "shortUrl", clicks FROM urls WHERE user_id = $1 ORDER BY id DESC;`
        const rows = await db.query(query, [userId])
        if (!rows || rows.length === 0) {
            return null
        }

        return rows as Url[]

    } catch (error) {
        console.error("Error in findUserUrls:", error)
        return null
    }
}


