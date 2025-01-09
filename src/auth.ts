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
                const result = await db
                    .select({
                        id: users.id,
                        name: users.name,
                        email: users.email,
                        emailVerified: users.emailVerified,
                        image: users.image,
                    })
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

                console.log('Debug: Query result:', result)

                const user = result[0]
                if (!user?.email) return null

                return {
                    ...user,
                    emailVerified: user.emailVerified ?? null,
                } as AdapterUser
            } catch (error) {
                console.error('Debug: Query error:', error)
                throw error
            }
        },

        // Add other methods as needed...
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: createCustomAdapter(),
    debug: true,
    session: {
        strategy: 'jwt',
    },
    ...authConfig,
})
