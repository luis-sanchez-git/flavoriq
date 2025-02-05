// Handles DB query logic for recipes

import { db } from '@/db/drizzle'
import { recipes, recipeIngredients, steps } from '@/db/schema'
import {
    IngredientType,
    RecipeType,
    RecipeStatus,
    IngredientCategory,
} from '@/schemas/recipeSchema'
import { and, eq, inArray } from 'drizzle-orm'

export class RecipesRepository {
    // Create initial recipe record
    async createInitialRecipe(recipe: string, userId: string) {
        const [recipeRecord] = await db
            .insert(recipes)
            .values({
                name: recipe,
                userId,
                serving: 1,
                duration: 'Processing...',
                status: 'PROCESSING' as RecipeStatus,
            })
            .returning({ id: recipes.id })

        return recipeRecord
    }

    // Update recipe with generated data
    async updateRecipeDetails(
        recipeId: string,
        recipeData: {
            name: string
            serving: number
            duration: string
            status: RecipeStatus
        },
    ) {
        await db.update(recipes).set(recipeData).where(eq(recipes.id, recipeId))
    }

    // Insert ingredients
    async insertIngredients(
        ingredients: {
            recipeId: string
            userId: string
            name: string
            quantity: number | undefined
            unit: string | undefined
            note: string | undefined
            category?: IngredientCategory
        }[],
    ) {
        return await db
            .insert(recipeIngredients)
            .values(ingredients)
            .returning({ id: recipeIngredients.id })
    }

    // Insert steps
    async insertSteps(
        stepsData: {
            recipeId: string
            userId: string
            stepNumber: number
            description: string
        }[],
    ) {
        await db.insert(steps).values(stepsData)
    }

    // Update ingredient categories
    async updateIngredientCategories(
        updates: { id: string; category: IngredientCategory }[],
    ) {
        await Promise.all(
            updates.map((update) =>
                db
                    .update(recipeIngredients)
                    .set({ category: update.category })
                    .where(eq(recipeIngredients.id, update.id)),
            ),
        )
    }

    async getRecipes(
        recipeIds: string[],
        filter: {
            userId?: string
        } = {},
    ) {
        const whereClause = []

        if (filter?.userId) {
            whereClause.push(eq(recipes.userId, filter.userId))
        }

        if (recipeIds.length > 0) {
            whereClause.push(inArray(recipes.id, recipeIds))
        }

        const recipesWithDetails = await db
            .select({
                id: recipes.id,
                name: recipes.name,
                serving: recipes.serving,
                duration: recipes.duration,
                status: recipes.status,
                userId: recipes.userId,
                ingredients: {
                    id: recipeIngredients.id,
                    name: recipeIngredients.name,
                    quantity: recipeIngredients.quantity,
                    unit: recipeIngredients.unit,
                    note: recipeIngredients.note,
                    category: recipeIngredients.category,
                },
                steps: {
                    id: steps.id,
                    stepNumber: steps.stepNumber,
                    description: steps.description,
                },
            })
            .from(recipes)
            .leftJoin(
                recipeIngredients,
                eq(recipes.id, recipeIngredients.recipeId),
            )
            .leftJoin(steps, eq(recipes.id, steps.recipeId))
            .where(and(...whereClause))
            .orderBy(steps.stepNumber)

        // Group the flat results by recipe
        const groupedRecipes: Record<string, RecipeType> =
            recipesWithDetails.reduce(
                (acc, row) => {
                    if (!acc[row.id]) {
                        acc[row.id] = {
                            id: row.id,
                            name: row.name,
                            serving: row.serving,
                            duration: row.duration,
                            ingredients: [],
                            steps: [],
                        }
                    }

                    // Add ingredient if not already added and convert nulls to undefined
                    if (
                        row.ingredients?.id &&
                        !acc[row.id].ingredients.some(
                            (ing) => ing.id === row.ingredients?.id,
                        )
                    ) {
                        acc[row.id].ingredients.push({
                            ...row.ingredients,
                            quantity: row.ingredients.quantity ?? undefined,
                            unit: row.ingredients.unit ?? undefined,
                            note: row.ingredients.note ?? undefined,
                        })
                    }

                    // Add step if not already added
                    if (
                        row?.steps?.id &&
                        !acc[row.id].steps.some(
                            (step) => step.id === row?.steps?.id,
                        )
                    ) {
                        acc[row.id].steps.push(row.steps)
                    }

                    return acc
                },
                {} as Record<string, RecipeType>,
            )

        return Object.values(groupedRecipes)
    }

    // Delete recipe and related data
    async deleteRecipe(recipeId: string, userId: string) {
        await db
            .delete(recipes)
            .where(and(eq(recipes.id, recipeId), eq(recipes.userId, userId)))
    }

    // Update full recipe (used in updateRecipeAction)
    async updateFullRecipe(
        recipeId: string,
        userId: string,
        recipeData: RecipeType,
    ) {
        // Update main recipe details
        await db
            .update(recipes)
            .set({
                name: recipeData.name,
                serving: recipeData.serving,
                duration: recipeData.duration,
            })
            .where(eq(recipes.id, recipeId))

        // Delete existing ingredients and steps
        await db
            .delete(recipeIngredients)
            .where(eq(recipeIngredients.recipeId, recipeId))
        await db.delete(steps).where(eq(steps.recipeId, recipeId))

        // Insert new ingredients
        const ingredientInserts = recipeData.ingredients.map(
            (ingredient: IngredientType) => ({
                recipeId,
                userId,
                name: ingredient.name,
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                note: ingredient.note,
                category:
                    ingredient.category || ('Other' as IngredientCategory),
            }),
        )

        const insertedIngredients =
            await this.insertIngredients(ingredientInserts)

        // Insert new steps
        await this.insertSteps(
            recipeData.steps.map((step) => ({
                recipeId,
                userId,
                stepNumber: step.stepNumber,
                description: step.description,
            })),
        )

        return insertedIngredients
    }

    async getRecipeIngredients(recipeId: string) {
        return await db
            .select({ id: recipeIngredients.id })
            .from(recipeIngredients)
            .where(eq(recipeIngredients.recipeId, recipeId))
    }
}

// Export singleton instance
export const recipesRepository = new RecipesRepository()
