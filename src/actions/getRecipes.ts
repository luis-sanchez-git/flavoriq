import { db } from "@/db/drizzle"
import { ingredients, recipes, steps } from "@/db/schema"
import { requireAuth } from "@/lib/auth"
import { fetchUserId } from "@/lib/db"
import { RecipeType } from "@/schemas/recipeSchema"
import { eq } from "drizzle-orm"

type JoinedRecipe = {
    recipeId: string
    recipeName: string
    serving: number
    duration: string
    ingredientName: string | null
    ingredientQuantity: number | null
    stepNumber: number | null
    stepDescription: string | null
}

function formatRecipes(recipeData: JoinedRecipe[]) {
    const recipesMap = new Map<string, RecipeType>()

    recipeData.forEach((row) => {
        const {
            recipeId,
            recipeName,
            serving,
            duration,
            ingredientName,
            ingredientQuantity,
            stepNumber,
            stepDescription,
        } = row

        const entryExists = recipesMap.has(recipeId)
        if (!entryExists) {
            recipesMap.set(recipeId, {
                name: recipeName,
                serving,
                duration,
                ingredients: [],
                steps: [],
            })
        }

        const recipe = recipesMap.get(recipeId)!

        // Add ingredient if it exists
        if (ingredientName !== null && ingredientQuantity !== null) {
            recipe.ingredients.push({
                name: ingredientName,
                quantity: ingredientQuantity,
            })
        }

        // Add steps if it exists
        if (stepNumber !== null && stepDescription !== null) {
            recipe.steps.push({
                stepNumber,
                description: stepDescription,
            })
        }
    })

    return [...recipesMap.values()]
}

export async function getRecipes() {
    try {
        const user = await requireAuth()

        // get the user id
        // Fetch user ID
        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new Error("User not found")
        }
        // use user id to get all recipes of user
        const recipeData = await db
            .select({
                recipeId: recipes.id,
                recipeName: recipes.name,
                serving: recipes.serving,
                duration: recipes.duration,
                ingredientName: ingredients.name,
                ingredientQuantity: ingredients.quantity,
                stepNumber: steps.stepNumber,
                stepDescription: steps.description,
            })
            .from(recipes)
            .leftJoin(ingredients, eq(recipes.id, ingredients.recipeId))
            .leftJoin(steps, eq(recipes.id, steps.recipeId))
            .where(eq(recipes.userId, userId))

        const formattedRecipes = formatRecipes(recipeData)
        return formattedRecipes
    } catch (e) {
        console.error("Error fetching recipes:", e)
        throw new Error("Failed to fetch recipes.")
    }
}
