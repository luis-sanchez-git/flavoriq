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

export type CreateRecipeState = {
    isSuccess?: boolean
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

// Helper to insert recipe into the database
async function insertRecipe(userId: string, recipeData: RecipeType) {
    const recipe = await db
        .insert(recipes)
        .values({
            name: recipeData.name,
            serving: recipeData.serving,
            duration: recipeData.duration,
            userId,
        })
        .returning({ id: recipes.id })

    return recipe[0]?.id || null
}

// Helper to insert ingredients and steps
async function insertRecipeDetails(
    userId: string,
    recipeId: string,
    recipeData: RecipeType,
) {
    const ingredientInserts = recipeData.ingredients.map(
        (ingredient: IngredientType) => ({
            recipeId: recipeId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            userId: userId,
            unit: ingredient.unit,
            note: ingredient.note,
        }),
    )
    await db.insert(recipeIngredients).values(ingredientInserts)

    const stepInserts = recipeData.steps.map((step: StepType) => ({
        recipeId: recipeId,
        stepNumber: step.stepNumber,
        description: step.description,
        userId: userId,
    }))
    await db.insert(steps).values(stepInserts)
}

// Main action function
export async function createNewRecipe(
    prevState: CreateRecipeState,
    formData: FormData,
): Promise<CreateRecipeState> {
    const respObj: CreateRecipeState = { error: '', isSuccess: true }

    try {
        // Authenticate user
        const user = await requireAuth()
        // Validate form data
        const recipe = validateRecipeForm(formData)
        if (!recipe) {
            throw new Error('Invalid form data')
        }

        // Generate recipe from OpenAI
        const [generateErr, responseObj] = await generateRecipe(recipe)
        if (generateErr || !responseObj) {
            throw new Error('Failed to generate recipe')
        }

        const { object: newRecipe } = responseObj

        // Fetch user ID
        const userId = await fetchUserId(user.email)

        if (!userId) {
            throw new Error('User not found')
        }

        // Insert recipe into database
        const recipeId = await insertRecipe(userId, newRecipe)
        if (!recipeId) {
            throw new Error('Failed to save recipe')
        }

        // Insert ingredients and steps
        await insertRecipeDetails(userId, recipeId, newRecipe)

        respObj.isSuccess = true
        revalidatePath('/recipes')
    } catch (error) {
        console.error('Error creating recipe:', error)
        respObj.error = error instanceof Error ? error.message : 'Unknown error'
        respObj.isSuccess = false
    }

    return respObj
}
