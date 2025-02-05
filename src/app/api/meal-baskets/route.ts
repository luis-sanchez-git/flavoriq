import { mealBasketController } from '@/server/controllers/mealBasketController'
import { NextResponse } from 'next/server'
import { AuthError, NotFoundError } from '@/lib/errors'

export async function GET() {
    try {
        const baskets = await mealBasketController.getMealBaskets()
        return NextResponse.json(baskets)
    } catch (error) {
        if (error instanceof AuthError) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
