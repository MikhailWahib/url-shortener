import { db } from "../db/db"

export type Url = {
    id: number;
    original_url: string;
    user_id: number;
    short_url: string;
    clicks: number;
}

export const createUrl = async (
    originalUrl: string,
    userId: number,
    shortUrlCode: string
): Promise<Url[] | null> => {
    try {
        const query = `INSERT INTO urls (original_url, user_id,short_url) VALUES ($1, $2, $3) RETURNING *;`
        const rows = await db.query(query, [originalUrl, userId, shortUrlCode])
        return rows as Url[]
    } catch (e) {
        console.error("Error creating URL: ", e)
        return null
    }
}

export const getOriginalUrlByCode = async (
    shortUrl: string
): Promise<string | null> => {
    try {
        const query = `SELECT * FROM urls WHERE short_url = $1;`
        const rows = await db.query(query, [shortUrl]) as Url[]
        if (!rows || rows.length === 0) {
            return null
        }

        return rows[0].original_url
    } catch (e) {
        console.error("Error getting original URL: ", e)
        return null
    }
}

export const incrementClicks = async (shortUrlCode: string): Promise<void> => {
    try {
        const query = `UPDATE urls SET clicks = clicks + 1 WHERE short_url = $1 RETURNING *;`
        await db.query(query, [shortUrlCode])
    } catch (e) {
        console.error("Error incrementing URL clicks: ", e)
    }
}


