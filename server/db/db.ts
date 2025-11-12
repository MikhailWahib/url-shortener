import dotenv from "dotenv"
import { neon } from '@neondatabase/serverless'

dotenv.config()

export const db = neon(process.env.DB_URL!)


