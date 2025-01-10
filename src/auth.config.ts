import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

export const authConfig = {
    providers: [
        Google,
        Credentials({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                password: { label: 'Password', type: 'password' },
                demoToken: { label: 'Demo Token', type: 'text' },
            },
            async authorize(credentials) {
                console.log('Debug: Credentials:', credentials)
                if (credentials?.demoToken === process.env.DEMO_TOKEN) {
                    return {
                        id: 'demo-user',
                        email: 'demo@flavoriq.com',
                        name: 'Demo User',
                        image: 'https://avatars.githubusercontent.com/u/67470890?s=200&v=4',
                    }
                }

                if (credentials?.password === 'password') {
                    return {
                        id: 'regular-user',
                        email: 'bob@alice.com',
                        name: 'Bob Alice',
                        image: 'https://avatars.githubusercontent.com/u/67470890?s=200&v=4',
                    }
                }
                return null
            },
        }),
    ],
    callbacks: {
        authorized: async ({ auth }) => {
            const isLoggedIn = !!auth
            return isLoggedIn
        },
    },
} satisfies NextAuthConfig
