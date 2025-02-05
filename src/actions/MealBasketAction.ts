'use server'

import { revalidatePath } from 'next/cache'
import { z } from 'zod'
import { MealBasketFormSchema } from '@/schemas/mealBasketsSchema'
import { mealBasketService } from '@/server/services/mealBasketService'
import { AuthError, NotFoundError } from '@/lib/errors'

export type ActionResponse<T = void> = {
    data?: T
    error?: string
    success?: boolean
}

// Schema definitions
const addRecipeToBasketSchema = z.object({
    recipeId: z.string().uuid(),
    basketId: z.string().uuid(),
})

const updateServingsSchema = z.record(
    z.string(),
    z.coerce.number().min(1).int(),
)

// Actions
export async function createMealBasket(
    prevState: ActionResponse,
    formData: FormData,
): Promise<ActionResponse> {
    try {
        // Form validation
        const validated = MealBasketFormSchema.parse({
            name: formData.get('name'),
            description: formData.get('description'),
        })

        // Delegate to service
        await mealBasketService.createMealBasket(validated)
        revalidatePath('/meal-baskets')

        return { success: true }
    } catch (error) {
        console.error('Failed to create meal basket:', error)
        return {
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to create meal basket',
            success: false,
        }
    }
}

export async function deleteMealBasket(id: string): Promise<ActionResponse> {
    try {
        await mealBasketService.deleteMealBasket(id)
        revalidatePath('/meal-baskets')
        return { success: true }
    } catch (error) {
        console.error('Failed to delete meal basket:', error)
        if (error instanceof NotFoundError || error instanceof AuthError) {
            return { error: error.message, success: false }
        }
        return { error: 'Failed to delete meal basket', success: false }
    }
}

export async function addRecipeToBasket(
    basketId: string,
    recipeId: string,
): Promise<ActionResponse> {
    try {
        // Validate input
        const validated = addRecipeToBasketSchema.parse({
            recipeId,
            basketId,
        })

        // Delegate to service
        await mealBasketService.addRecipeToBasket(
            validated.basketId,
            validated.recipeId,
        )
        revalidatePath(`/meal-baskets/${basketId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to add recipe to basket:', error)
        return {
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to add recipe to basket',
            success: false,
        }
    }
}

export async function updateServings(
    basketId: string,
    prevState: ActionResponse,
    formData: FormData,
): Promise<ActionResponse> {
    try {
        // Validate input
        const formObject = Object.fromEntries(formData.entries())
        const validated = updateServingsSchema.parse(formObject)

        // Delegate to service
        await mealBasketService.updateServings(basketId, validated)
        revalidatePath(`/meal-baskets/${basketId}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to update servings:', error)
        return {
            error:
                error instanceof Error
                    ? error.message
                    : 'Failed to update servings',
            success: false,
        }
    }
}
