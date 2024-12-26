import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [
        Google,
        Credentials({
            id: "password",
            name: "Password",
            credentials: {
                password: { label: "Password", type: "password" },
            },
            authorize: (credentials) => {
                if (credentials.password === "password") {
                    return {
                        email: "bob@alice.com",
                        name: "Bob Alice",
                        image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
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
