import { mealBasketController } from '@/server/controllers/mealBasketController'
import { NextResponse, NextRequest } from 'next/server'
import { AuthError, NotFoundError } from '@/lib/errors'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params
    try {
        const basket = await mealBasketController.getMealBasket(id)
        return NextResponse.json(basket)
    } catch (error) {
        if (error instanceof NotFoundError) {
            return NextResponse.json({ error: error.message }, { status: 404 })
        }
        if (error instanceof AuthError) {
            return NextResponse.json({ error: error.message }, { status: 401 })
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 },
        )
    }
}
