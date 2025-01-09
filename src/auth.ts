import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import { db } from './db/drizzle'
import { and, eq } from 'drizzle-orm'
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
                // Simplest possible query - just get one user
                const result = await db.select().from(users).limit(1)

                console.log('Debug: Simple query result:', result)

                // Just to test if basic queries work
                if (!result[0]) return null

                return {
                    id: result[0].id,
                    name: result[0].name,
                    email: result[0].email,
                    emailVerified: result[0].emailVerified ?? null,
                    image: result[0].image,
                } as AdapterUser
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
