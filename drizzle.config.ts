import type { Config } from 'drizzle-kit'
import { env } from '@/env'

export default {
  schema: './src/db/schema/index.ts',
  out: './src/db/drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: env.DB_URL,
  },
} satisfies Config
