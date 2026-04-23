import { neon } from '@neondatabase/serverless'

if (!process.env.DATABASE_URL) {
  console.warn('DATABASE_URL is not set — database queries will fail at runtime')
}

const sql = neon(process.env.DATABASE_URL || 'postgresql://noop:noop@localhost/noop')

export { sql }
