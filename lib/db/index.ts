import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import * as schema from "./schema"

function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set")
  }
  return drizzle(neon(process.env.DATABASE_URL), { schema })
}

// Lazy singleton — only connects when first called at runtime
let _db: ReturnType<typeof getDb> | null = null
export const db = new Proxy({} as ReturnType<typeof getDb>, {
  get(_, prop) {
    if (!_db) _db = getDb()
    return (_db as any)[prop]
  },
})
