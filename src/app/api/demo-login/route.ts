import { signIn } from '@/auth'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    const demoToken = process.env.DEMO_TOKEN

    try {
        // Pass the token directly as credentials
        const result = await signIn('credentials', {
            demoToken,
            redirect: false,
            callbackUrl: '/recipes',
        })

        if (result?.error) {
            throw new Error(result.error)
        }

        return NextResponse.redirect(new URL('/recipes', request.url))
    } catch (error) {
        return NextResponse.json({ error: 'Failed to login' }, { status: 500 })
    }
}
