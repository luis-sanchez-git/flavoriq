'use server'

import { db } from '@/db/drizzle'
import { mealBasketRecipes, mealBaskets } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/errors/errors'
import { fetchUserId } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const addRecipeToBasketSchema = z.object({
    recipeId: z.string().uuid(),
    basketId: z.string().uuid(),
})

const updateServingsSchema = z.record(
    z.string(),
    z.coerce.number().min(1).int(),
)

export async function deleteMealBasketAction(id: string) {
    try {
        const user = await requireAuth()
        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new RecipeError('User not found')
        }

        await db.delete(mealBaskets).where(and(eq(mealBaskets.id, id)))
        revalidatePath('/meal-baskets')
        return { success: true }
    } catch (e) {
        if (e instanceof RecipeError) {
            console.error(`[RecipeError]: ${e.message}`, {
                details: e.details,
            })
        } else {
            console.error(`[UnhandledError]: ${e}`)
        }
        return { success: false }
    }
}

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
