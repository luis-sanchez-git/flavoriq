import { db } from '@/db/drizzle'
import { mealBaskets, mealBasketRecipes, recipes } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { eq, inArray, sql } from 'drizzle-orm'

export type MealBasket = {
    id: string
    name: string
    description: string | null
    recipeCount: number
}

export async function getMealBaskets() {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    // Get all baskets with their recipe counts
    const baskets = await db
        .select({
            id: mealBaskets.id,
            name: mealBaskets.name,
            description: mealBaskets.description,
        })
        .from(mealBaskets)
        .where(eq(mealBaskets.userId, userId))

    return baskets
}

export async function getMealBasket(id: string) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    const basketWithRecipes = await db
        .select({
            basketName: mealBaskets.name,
            recipeName: recipes.name,
            plannedServings: mealBasketRecipes.plannedServings,
            // Add other recipe fields you need here
        })
        .from(mealBaskets)
        .innerJoin(
            mealBasketRecipes,
            eq(mealBaskets.id, mealBasketRecipes.mealBasketId),
        )
        .innerJoin(recipes, eq(mealBasketRecipes.recipeId, recipes.id))
        .where(eq(mealBaskets.id, id))

    // Transform the flat results into your desired nested structure
    const response = {
        name: basketWithRecipes[0]?.basketName,
        recipes: basketWithRecipes.map((row) => ({
            recipeName: row.recipeName,
            servings: row.plannedServings,
            // You can add the ingredients query here when ready
            ingredients: [],
        })),
    }
    return response
}

export async function getUserRecipes() {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    const userRecipes = await db
        .select({
            id: recipes.id,
            name: recipes.name,
            mealBasketIds: sql<string[]>`array_agg(${mealBaskets.id})`,
        })
        .from(recipes)
        .leftJoin(mealBasketRecipes, eq(recipes.id, mealBasketRecipes.recipeId))
        .leftJoin(
            mealBaskets,
            eq(mealBasketRecipes.mealBasketId, mealBaskets.id),
        )
        .where(eq(recipes.userId, userId))
        .groupBy(recipes.id)

    return userRecipes
}

export async function addRecipeToBasket(basketId: string, recipeId: string) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    await db.insert(mealBasketRecipes).values({
        mealBasketId: basketId,
        recipeId: recipeId,
        plannedServings: 1, // Default to 1 serving
    })
}
