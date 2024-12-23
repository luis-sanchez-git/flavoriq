"use server"

import { catchError } from "@/lib/utils"
import { newRecipeFormSchema } from "@/schemas/newRecipeSchema"
import {
    IngredientType,
    RecipeSchema,
    RecipeType,
    StepType,
} from "@/schemas/recipeSchema"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { auth } from "@/auth"
import { db } from "@/db/drizzle"
import { ingredients, recipes, steps, users } from "@/db/schema"
import { eq } from "drizzle-orm"

export type CreateRecipeState = {
    isSuccess?: boolean
    error?: string
}

const modelName = "gpt-4o-2024-08-06"

// Helper to fetch user ID
async function fetchUserId(email: string | undefined): Promise<string | null> {
    if (!email) return null
    const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    return user[0]?.id || null
}

// Helper to validate recipe form data
function validateRecipeForm(formData: FormData): string | null {
    const validatedFields = newRecipeFormSchema.safeParse({
        recipe: formData.get("recipe"),
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
            recipeId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            userId,
        }),
    )
    await db.insert(ingredients).values(ingredientInserts)

    const stepInserts = recipeData.steps.map((step: StepType) => ({
        recipeId,
        stepNumber: step.stepNumber,
        description: step.description,
        userId,
    }))
    await db.insert(steps).values(stepInserts)
}

// Main action function
export async function createNewRecipe(
    prevState: CreateRecipeState,
    formData: FormData,
): Promise<CreateRecipeState> {
    const respObj: CreateRecipeState = { error: "", isSuccess: true }

    try {
        // Authenticate user
        const session = await auth()
        if (!session?.user?.email) {
            throw new Error("Unauthorized")
        }

        // Validate form data
        const recipe = validateRecipeForm(formData)
        if (!recipe) {
            throw new Error("Invalid form data")
        }

        // Generate recipe from OpenAI
        const [generateErr, responseObj] = await generateRecipe(recipe)
        if (generateErr || !responseObj) {
            throw new Error("Failed to generate recipe")
        }

        const { object: newRecipe } = responseObj

        // Fetch user ID
        const userId = await fetchUserId(session.user.email)
        if (!userId) {
            throw new Error("User not found")
        }

        // Insert recipe into database
        const recipeId = await insertRecipe(userId, newRecipe)
        if (!recipeId) {
            throw new Error("Failed to save recipe")
        }

        // Insert ingredients and steps
        await insertRecipeDetails(userId, recipeId, newRecipe)

        respObj.isSuccess = true
    } catch (error) {
        console.error("Error creating recipe:", error)
        respObj.error = error instanceof Error ? error.message : "Unknown error"
        respObj.isSuccess = false
    }

    return respObj
}
