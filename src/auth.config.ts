import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
    providers: [Google],
    callbacks: {
        authorized: async ({ auth }) => {
            const isLoggedIn = !!auth
            return isLoggedIn
        },
    },
} satisfies NextAuthConfig
