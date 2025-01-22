'use server'

import { catchError } from '@/lib/utils'
import { newRecipeFormSchema } from '@/schemas/newRecipeSchema'
import {
    IngredientType,
    RecipeSchema,
    RecipeType,
    StepType,
} from '@/schemas/recipeSchema'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { db } from '@/db/drizzle'
import { recipeIngredients, recipes, steps } from '@/db/schema'
import { fetchUserId } from '@/lib/db'
import { requireAuth } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { categorizeIngredientsBatch } from '@/lib/categorizeIngredient'
import { IngredientCategory } from '@/schemas/recipeSchema'
import { eq } from 'drizzle-orm'

export type CreateRecipeState = {
    recipeId?: string
    error?: string
}

const modelName = process.env.OPENAI_CREATE_RECIPE_MODEL!

// Helper to validate recipe form data
function validateRecipeForm(formData: FormData): string | null {
    const validatedFields = newRecipeFormSchema.safeParse({
        recipe: formData.get('recipe'),
    })

    if (!validatedFields.success) return null
    return validatedFields.data.recipe
}

// Helper to generate a recipe using OpenAI
async function generateRecipe(recipePrompt: string) {
    return catchError(
        generateObject({
            model: openai(modelName),
            schema: RecipeSchema,
            prompt: `Recipe for ${recipePrompt}`,
        }),
    )
}
// Helper to insert ingredients and steps
async function insertRecipeDetails(
    userId: string,
    recipeId: string,
    recipeData: RecipeType,
) {
    // Insert ingredients without category (defaults to 'Other')
    const ingredientInserts = recipeData.ingredients.map((ingredient) => ({
        recipeId,
        userId,
        name: ingredient.name,
        quantity: ingredient.quantity,
        unit: ingredient.unit,
        note: ingredient.note,
    }))

    const insertedIngredients = await db
        .insert(recipeIngredients)
        .values(ingredientInserts)
        .returning({ id: recipeIngredients.id })

    // Insert steps
    const stepInserts = recipeData.steps.map((step: StepType) => ({
        recipeId,
        stepNumber: step.stepNumber,
        description: step.description,
        userId,
    }))
    await db.insert(steps).values(stepInserts)

    // Start categorization after main inserts complete
    setTimeout(() => {
        categorizeIngredientsBatch(
            recipeData.ingredients.map((ing) => ({
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
                revalidatePath('/recipes')
            })
            .catch(console.error)
    }, 0)
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

        // Insert initial recipe record
        const [recipeRecord] = await db
            .insert(recipes)
            .values({
                name: recipe, // Use prompt as initial name
                userId,
                serving: 1, // Default values
                duration: 'Processing...',
            })
            .returning({ id: recipes.id })

        console.log('recipeRecord', recipeRecord)

        // Start async recipe creation
        void processRecipeCreation(recipe, userId, recipeRecord.id)

        return { recipeId: recipeRecord.id }
    } catch (error) {
        console.error('Error initiating recipe creation:', error)
        return {
            error: error instanceof Error ? error.message : 'Unknown error',
        }
    }
}

// New function to check recipe status
export async function checkRecipeStatus(recipeId: string) {
    const recipe = await db
        .select()
        .from(recipes)
        .where(eq(recipes.id, recipeId))
        .limit(1)

    return recipe[0]
}

// New async processing function
async function processRecipeCreation(
    recipePrompt: string,
    userId: string,
    recipeId: string,
) {
    try {
        // Generate recipe from OpenAI
        const [generateErr, responseObj] = await generateRecipe(recipePrompt)
        if (generateErr || !responseObj) {
            throw new Error('Failed to generate recipe')
        }

        const { object: newRecipe } = responseObj

        // Update recipe with generated data
        await db
            .update(recipes)
            .set({
                name: newRecipe.name,
                serving: newRecipe.serving,
                duration: newRecipe.duration,
            })
            .where(eq(recipes.id, recipeId))

        // Insert ingredients and steps
        await insertRecipeDetails(userId, recipeId, newRecipe)
    } catch (error) {
        console.error('Error in recipe creation:', error)
        // Delete the recipe if generation failed
        await db.delete(recipes).where(eq(recipes.id, recipeId))
    }
}
