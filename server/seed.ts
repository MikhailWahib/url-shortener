import { createUrlsTable, createUsersTable } from "./db/schema"

async function seed() {
    try {
        await createUsersTable()
        await createUrlsTable()
    } catch (e) {
        console.error(e)
    }
}

seed()


