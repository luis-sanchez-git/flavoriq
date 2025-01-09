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

    return {
        // Implement the critical getUserByAccount method explicitly
        getUserByAccount: async (providerAccount: {
            provider: string
            providerAccountId: string
        }) => {
            console.log('Debug: getUserByAccount called with:', providerAccount)

            try {
                const dbAccount = await db
                    .select()
                    .from(accounts)
                    .where(
                        and(
                            eq(accounts.provider, providerAccount.provider),
                            eq(
                                accounts.providerAccountId,
                                providerAccount.providerAccountId,
                            ),
                        ),
                    )
                    .leftJoin(users, eq(accounts.userId, users.id))
                    .then((rows) => rows[0])

                console.log('Debug: Found account:', dbAccount)

                if (!dbAccount?.user || !dbAccount.user.email) {
                    return null
                }

                return {
                    ...dbAccount.user,
                    email: dbAccount.user.email,
                    emailVerified: dbAccount.user.emailVerified ?? null,
                } as AdapterUser
            } catch (error) {
                console.error('Debug: Database query failed:', error)
                throw error
            }
        },

        // Add other methods as needed...
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: DrizzleAdapter(db),
    debug: true,
    session: {
        strategy: 'jwt',
    },
    ...authConfig,
})
