'use server'

import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/errors/errors'
import { fetchUserId } from '@/lib/db'
import { RecipeType } from '@/schemas/recipeSchema'
import { recipeService } from '@/server/services/recipeService'

export async function updateRecipe(
    recipeId: string,
    updatedRecipe: RecipeType,
) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)
    if (!userId) {
        throw new RecipeError('User not found')
    }

    await recipeService.updateRecipe(recipeId, userId, updatedRecipe)
}
