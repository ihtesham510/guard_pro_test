import { defineConfig } from 'drizzle-kit'
import { config } from 'dotenv'
import path from 'path'

config({ path: path.resolve(__dirname, '../.env') })

config({ path: path.resolve(__dirname, '.env') })

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
