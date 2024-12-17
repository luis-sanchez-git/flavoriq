import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"

export const authConfig = {
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user
            const isOnRecipes = nextUrl.pathname.startsWith("/recipes")
            if (isOnRecipes) {
                if (isLoggedIn) return true
                return false // Redirect unauthenticated users to login page
            } else if (isLoggedIn) {
                return Response.redirect(new URL("/recipes", nextUrl))
            }
            return true
        },
    },
    providers: [Google],
} satisfies NextAuthConfig
