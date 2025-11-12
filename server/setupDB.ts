import { createUrlsTable, createUsersTable } from "./db/schema"

async function setupDB() {
    try {
        await createUsersTable()
        await createUrlsTable()
    } catch (e) {
        console.error(e)
    }
}

setupDB()
