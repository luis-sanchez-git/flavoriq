import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db/drizzle'
import { and, eq, sql } from 'drizzle-orm'
import { accounts, users } from './db/schema'
import type { AdapterUser } from 'next-auth/adapters'

// Create a custom adapter with explicit implementations
const createCustomAdapter = () => {
    console.log('Debug: Creating custom adapter')
    console.log('Debug: DB instance exists:', !!db)
    console.log('Debug: DB methods:', Object.keys(db))

    return {
        // Implement the critical getUserByAccount method explicitly
        getUserByAccount: async (providerAccount: {
            provider: string
            providerAccountId: string
        }) => {
            console.log('Debug: getUserByAccount called with:', providerAccount)
            console.log('Debug: DB state at execution:', !!db)

            try {
                // Most basic SQL query possible
                const result = await db.execute(sql`SELECT 1 as test`)

                console.log('Debug: Basic SQL test result:', result)

                return null // Just testing if we can query at all
            } catch (error) {
                console.error('Debug: Query error details:', {
                    error: (error as Error).message,
                    stack: (error as Error).stack,
                    db: !!db,
                })
                throw error
            }
        },

        // Add other methods as needed...
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: createCustomAdapter(),
    debug: true,
    logger: {
        error(code, ...message) {
            console.error('Auth Error:', { code, message })
        },
        warn(code, ...message) {
            console.warn('Auth Warning:', { code, message })
        },
        debug(code, ...message) {
            console.log('Auth Debug:', { code, message })
        },
    },
    session: {
        strategy: 'jwt',
    },
    ...authConfig,
})
