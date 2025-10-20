import { db } from "../db/db"

export interface Url {
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
): Promise<Url[]> => {
    const query = `INSERT INTO urls (original_url, user_id,short_url) VALUES ($1, $2, $3) RETURNING *;`
    const result = await db.query(query, [originalUrl, userId, shortUrlCode])
    return result as unknown as Url[]
}

export const findOriginalUrlByCode = async (
    shortUrl: string
): Promise<Url[]> => {
    const query = `SELECT * FROM urls WHERE short_url = $1;`
    const result = await db.query(query, [shortUrl])
    return result as unknown as Url[]
}

export const incrementClicks = async (shortUrlCode: string): Promise<void> => {
    const query = `UPDATE urls SET clicks = clicks + 1 WHERE short_url = $1 RETURNING *;`
    await db.query(query, [shortUrlCode])
}


