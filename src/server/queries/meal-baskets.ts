import { db } from '@/db/drizzle'
import { mealBaskets, mealBasketRecipes, recipes } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { eq, count } from 'drizzle-orm'

export type MealBasket = {
    id: string
    name: string
    description: string | null
    recipeCount: number
}

export async function getMealBaskets() {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    // Get all baskets with their recipe counts
    const baskets = await db
        .select({
            id: mealBaskets.id,
            name: mealBaskets.name,
            description: mealBaskets.description,
        })
        .from(mealBaskets)
        .where(eq(mealBaskets.userId, userId))

    return baskets
}
