'use server'

import { db } from '@/db/drizzle'
import { recipes, recipeIngredients, steps } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/errors/errors'
import { fetchUserId } from '@/lib/db'
import { IngredientType, RecipeType } from '@/schemas/recipeSchema'
import { eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { categorizeIngredientsBatch } from '@/lib/categorizeIngredient'

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

    // Insert new ingredients without categories first
    const ingredientInserts = updatedRecipe.ingredients.map(
        (ingredient: IngredientType) => ({
            recipeId,
            userId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit,
            note: ingredient.note,
        }),
    )

    const insertedIngredients = await db
        .insert(recipeIngredients)
        .values(ingredientInserts)
        .returning({ id: recipeIngredients.id })

    // Insert new steps
    await db.insert(steps).values(
        updatedRecipe.steps.map((step) => ({
            recipeId,
            userId,
            stepNumber: step.stepNumber,
            description: step.description,
        })),
    )

    // Start categorization after main updates complete
    setTimeout(() => {
        categorizeIngredientsBatch(
            updatedRecipe.ingredients.map((ing) => ({
                name: ing.name,
                note: ing.note,
            })),
        )
            .then(async (categories) => {
                await Promise.all(
                    insertedIngredients.map((ing, index) =>
                        db
                            .update(recipeIngredients)
                            .set({ category: categories[index] })
                            .where(eq(recipeIngredients.id, ing.id)),
                    ),
                )
                revalidatePath(`/recipes/${recipeId}`)
            })
            .catch(console.error)
    }, 0)

    revalidatePath(`/recipes/${recipeId}`)
}
