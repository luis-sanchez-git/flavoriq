import { db } from '@/db/drizzle'
import { mealBaskets, mealBasketRecipes, recipes } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { eq, sql, and, not, exists } from 'drizzle-orm'
import { getRecipes } from './recipes'
import { unstable_cache } from 'next/cache'

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

    return unstable_cache(
        async (uid: string) => {
            // Get all baskets with their recipe counts
            const baskets = await db
                .select({
                    id: mealBaskets.id,
                    name: mealBaskets.name,
                    description: mealBaskets.description,
                })
                .from(mealBaskets)
                .where(eq(mealBaskets.userId, uid))

            return baskets
        },
        ['meal-baskets', userId],
    )(userId)
}

export async function getMealBasket(id: string) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }

    // Get basket info
    const basket = await db
        .select({
            id: mealBaskets.id,
            name: mealBaskets.name,
        })
        .from(mealBaskets)
        .where(eq(mealBaskets.id, id))
        .limit(1)

    if (!basket[0]) {
        throw new Error('Basket not found')
    }

    // Get recipe IDs in this basket
    const basketRecipes = await db
        .select({
            recipeId: mealBasketRecipes.recipeId,
            plannedServings: mealBasketRecipes.plannedServings,
        })
        .from(mealBasketRecipes)
        .where(eq(mealBasketRecipes.mealBasketId, id))

    // Get full recipe data
    const recipeIds = basketRecipes.map((r) => r.recipeId)
    const recipes = await getRecipes({ recipeIds })

    // Merge planned servings with recipe data
    const recipesWithServings = recipes.map((recipe) => ({
        ...recipe,
        plannedServings:
            basketRecipes.find((br) => br.recipeId === recipe.id)
                ?.plannedServings ?? 1,
    }))

    return {
        ...basket[0],
        recipes: recipesWithServings,
    }
}

export async function getServingsRecipes() {
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
        .groupBy(recipes.id, mealBasketRecipes.recipeId)

    return userRecipes
}

export async function getAvailableRecipes(basketId: string) {
    const user = await requireAuth()
    const userId = await fetchUserId(user.email)

    if (!userId) {
        throw new Error('User not found')
    }
    // get recipes that are in this basket
    const basketRecipes = db
        .select()
        .from(mealBasketRecipes)
        .where(
            and(
                eq(mealBasketRecipes.recipeId, recipes.id),
                eq(mealBasketRecipes.mealBasketId, basketId),
            ),
        )
    // get recipes that are not in this basket
    const availableRecipes = await db
        .select({
            id: recipes.id,
            name: recipes.name,
        })
        .from(recipes)
        .where(and(eq(recipes.userId, userId), not(exists(basketRecipes))))

    return availableRecipes
}
