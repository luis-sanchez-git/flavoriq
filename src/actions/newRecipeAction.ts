'use server'

import { newRecipeFormSchema } from '@/schemas/newRecipeSchema'
import { fetchUserId } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { recipeService } from '@/server/services/recipeService'

export type CreateRecipeState = {
    recipeId?: string
    error?: string
}

// Helper to validate recipe form data
function validateRecipeForm(formData: FormData): string | null {
    const validatedFields = newRecipeFormSchema.safeParse({
        recipe: formData.get('recipe'),
    })

    if (!validatedFields.success) return null
    return validatedFields.data.recipe
}

// Main action function
export async function createNewRecipe(
    prevState: CreateRecipeState,
    formData: FormData,
): Promise<CreateRecipeState> {
    try {
        // Authenticate user
        const user = await requireAuth()

        // Validate form data
        const recipe = validateRecipeForm(formData)
        if (!recipe) {
            throw new Error('Invalid form data')
        }

        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new Error('User not found')
        }

        // Create recipe through service
        const { recipeId } = await recipeService.createRecipe(recipe, userId)
        return { recipeId }
    } catch (error) {
        console.error('Error initiating recipe creation:', error)
        return {
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// Status check function
export async function checkRecipeStatus(recipeId: string) {
    return recipeService.getRecipeStatus(recipeId)
}
