'use server'

import { db } from '@/db/drizzle'
import { mealBasketRecipes } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'

import { z } from 'zod'
import { and, eq } from 'drizzle-orm'

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

const updateServingsSchema = z.record(
    z.string(),
    z.coerce.number().min(1).int(),
)
export async function updateServings(
    basketId: string,
    prevState: { isSuccess: boolean; error?: string },
    formData: FormData,
) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    const formObject = Object.fromEntries(formData.entries())

    const { success, data } = updateServingsSchema.safeParse(formObject)

    if (!success) {
        throw new Error('Invalid form data')
    }

    console.log(Object.entries(data))

    // Update each recipe's servings in the basket
    await Promise.all(
        Object.entries(data).map(([recipeId, servings]) =>
            db
                .update(mealBasketRecipes)
                .set({ plannedServings: servings })
                .where(
                    and(
                        eq(mealBasketRecipes.mealBasketId, basketId),
                        eq(mealBasketRecipes.recipeId, recipeId),
                    ),
                ),
        ),
    )

    return { isSuccess: true, error: undefined }
}
