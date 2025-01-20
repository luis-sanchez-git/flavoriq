'use server'

import { db } from '@/db/drizzle'
import { mealBasketRecipes } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { z } from 'zod'

const addRecipeToBasketSchema = z.object({
    recipeId: z.string().uuid(),
    basketId: z.string().uuid(),
})

export async function addRecipeToBasket(basketId: string, recipeId: string) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    const { success, data } = addRecipeToBasketSchema.safeParse({
        recipeId: recipeId,
        basketId: basketId,
    })

    if (!success) {
        throw new Error('Invalid form data')
    }

    if (!userId) {
        throw new Error('User not found')
    }

    await db.insert(mealBasketRecipes).values({
        mealBasketId: data.basketId,
        recipeId: data.recipeId,
        plannedServings: 1, // Default to 1 serving
    })

    return { success: true }
}
