'use server'

import { db } from '@/db/drizzle'
import { recipes, recipeIngredients, steps } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/errors/errors'
import { fetchUserId } from '@/lib/db'
import { RecipeType } from '@/schemas/recipeSchema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { categorizeIngredient } from '@/lib/categorizeIngredient'

// since updating is not common, we delete and insert instead of diffing
export async function updateRecipe(
    recipeId: string,
    updatedRecipe: RecipeType,
) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)
    if (!userId) {
        throw new RecipeError('User not found')
    }
    // Update recipe details
    await db
        .update(recipes)
        .set({
            name: updatedRecipe.name,
            serving: updatedRecipe.serving,
            duration: updatedRecipe.duration,
        })
        .where(eq(recipes.id, recipeId))

    // Delete existing ingredients and steps
    await db
        .delete(recipeIngredients)
        .where(eq(recipeIngredients.recipeId, recipeId))
    await db.delete(steps).where(eq(steps.recipeId, recipeId))

    // Insert new ingredients
    const ingredientsWithCategories = await Promise.all(
        updatedRecipe.ingredients.map(async (ingredient) => ({
            recipeId,
            userId: userId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            note: ingredient.note,
            category: await categorizeIngredient(
                ingredient.name,
                ingredient.note,
            ),
        })),
    )

    await db.insert(recipeIngredients).values(ingredientsWithCategories)

    // Insert new steps
    await db.insert(steps).values(
        updatedRecipe.steps.map((step) => ({
            recipeId,
            userId: userId,
            stepNumber: step.stepNumber,
            description: step.description,
        })),
    )

    revalidatePath(`/recipes/${recipeId}`)
}
