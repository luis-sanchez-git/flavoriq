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
                // First try a simpler query to test the connection
                const testQuery = await db.select().from(users).limit(1)
                console.log('Debug: Test query result:', testQuery)

                // If we get here, try the full query
                const result = await db
                    .select()
                    .from(accounts)
                    .innerJoin(users, eq(accounts.userId, users.id))
                    .where(
                        and(
                            eq(accounts.provider, providerAccount.provider),
                            eq(
                                accounts.providerAccountId,
                                providerAccount.providerAccountId,
                            ),
                        ),
                    )
                    .limit(1)

                console.log('Debug: Main query result:', result)

                const user = result[0]?.user
                if (!user?.email) return null

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    emailVerified: user.emailVerified ?? null,
                    image: user.image,
                } as AdapterUser
            } catch (error) {
                console.error('Debug: Query error details:', {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    stack:
                        error instanceof Error ? error.stack : 'Unknown stack',
                    db: !!db,
                    accounts: !!accounts,
                    users: !!users,
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
