'use server'

import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/errors/errors'
import { fetchUserId } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { recipeService } from '@/server/services/recipeService'

export async function deleteRecipeAction(id: string) {
    try {
        const user = await requireAuth()
        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new RecipeError('User not found')
        }
        await recipeService.deleteRecipe(id, userId)
        revalidatePath('/recipes')
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
