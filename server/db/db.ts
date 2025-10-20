import dotenv from "dotenv"
import { neon } from '@neondatabase/serverless'

dotenv.config()

// Create the neon client using a simple connection without WebSocket
export const db = neon(process.env.DB_URL!)


