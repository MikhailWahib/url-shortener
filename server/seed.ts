import { db } from "./db/db"
import { createUrlsTable, createUsersTable } from "./db/schema"

async function seed() {
    try {
        await db.connect()
        console.log("Connected to database")

        await createUsersTable()
        await createUrlsTable()

        console.log("Schema ensured. Add demo data here if needed.")
    } catch (e) {
        console.error(e)
    } finally {
        await db.end()
    }
}

seed()


