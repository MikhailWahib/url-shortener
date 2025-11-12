import { db } from "./db"

export const createUrlsTable = async (): Promise<void> => {
    const query = `
        CREATE TABLE IF NOT EXISTS urls (
            id SERIAL PRIMARY KEY,
			user_id INTEGER REFERENCES users(id),
            original_url TEXT NOT NULL,
            short_url TEXT NOT NULL UNIQUE,
			clicks INTEGER DEFAULT 0
        );
    `
    await db.query(query)
}

export const createUsersTable = async (): Promise<void> => {
    const query = `
		CREATE TABLE IF NOT EXISTS users (
			id SERIAL PRIMARY KEY,
			username TEXT NOT NULL UNIQUE,
			password TEXT NOT NULL	
		);
	`
    await db.query(query)
}


