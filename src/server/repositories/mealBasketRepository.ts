import { db } from '@/db/drizzle'
import { mealBaskets, mealBasketRecipes, recipes } from '@/db/schema'
import { eq, and, not, exists, sql, inArray } from 'drizzle-orm'
import { NotFoundError } from '@/lib/errors'
import {
    MealBasket,
    MealBasketForm,
    BasketWithRecipes,
} from '@/schemas/mealBasketsSchema'
import { recipesRepository } from './recipesRepository'
export class MealBasketRepository {
    private static CACHE_TTL = 60 // seconds

    async getBaskets(userId: string): Promise<MealBasket[]> {
        return db
            .select({
                id: mealBaskets.id,
                name: mealBaskets.name,
                description: mealBaskets.description,
                userId: mealBaskets.userId,
            })
            .from(mealBaskets)
            .where(eq(mealBaskets.userId, userId))
    }

    // candidate for refactoring: split pure db query from business logic
    async getBasketWithRecipes(
        id: string,
        userId: string,
    ): Promise<BasketWithRecipes> {
        // Get basket info
        const basket = await this.getBasketById(id, userId)

        // Get recipe IDs in this basket
        const basketRecipes = await db
            .select({
                recipeId: mealBasketRecipes.recipeId,
                plannedServings: mealBasketRecipes.plannedServings,
            })
            .from(mealBasketRecipes)
            .where(and(eq(mealBasketRecipes.mealBasketId, id)))

        // Get full recipe data
        const recipeIds = basketRecipes.map((r) => r.recipeId)
        if (recipeIds.length === 0) {
            return {
                ...basket,
                recipes: [],
            }
        }

        const recipes = await recipesRepository.getRecipes(recipeIds)

        // Merge planned servings with recipe data
        const recipesWithServings = recipes.map((recipe) => ({
            ...recipe,
            plannedServings:
                basketRecipes.find((br) => br.recipeId === recipe.id)
                    ?.plannedServings ?? 1,
        }))
        // missing ingredients and steps
        return {
            ...basket,
            recipes: recipesWithServings,
        }
    }

    async deleteBasket(id: string) {
        await db.delete(mealBaskets).where(and(eq(mealBaskets.id, id)))
    }

    async getBasketById(id: string, userId: string) {
        const basket = await db
            .select()
            .from(mealBaskets)
            .where(and(eq(mealBaskets.id, id), eq(mealBaskets.userId, userId)))
            .limit(1)

        if (!basket[0]) {
            throw new NotFoundError('Meal basket')
        }

        return basket[0]
    }

    async createBasket(data: MealBasketForm, userId: string) {
        const [basket] = await db
            .insert(mealBaskets)
            .values({
                name: data.name,
                description: data.description ?? undefined,
                id: data.id ?? undefined,
                userId,
            })
            .returning()

        return basket
    }

    async getAvailableRecipes(basketId: string, userId: string) {
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
        return db
            .select({
                id: recipes.id,
                name: recipes.name,
            })
            .from(recipes)
            .where(and(eq(recipes.userId, userId), not(exists(basketRecipes))))
    }

    async getServingsRecipes(userId: string) {
        return db
            .select({
                id: recipes.id,
                name: recipes.name,
                mealBasketIds: sql<string[]>`array_agg(${mealBaskets.id})`,
            })
            .from(recipes)
            .leftJoin(
                mealBasketRecipes,
                eq(recipes.id, mealBasketRecipes.recipeId),
            )
            .leftJoin(
                mealBaskets,
                eq(mealBasketRecipes.mealBasketId, mealBaskets.id),
            )
            .where(eq(recipes.userId, userId))
            .groupBy(recipes.id, mealBasketRecipes.recipeId)
    }

    async addRecipeToBasket(basketId: string, recipeId: string) {
        await db.insert(mealBasketRecipes).values({
            mealBasketId: basketId,
            recipeId: recipeId,
        })
    }

    async updateServings(basketId: string, servings: Record<string, number>) {
        const recipeIds = Object.keys(servings)

        // Build the when clauses
        const whenClauses = Object.entries(servings).map(
            ([recipeId, servings]) =>
                sql`WHEN ${recipeId} THEN ${servings}::integer`,
        )

        // Combine the when clauses with the CASE statement
        const servingsCaseStatement = sql`
            CASE ${mealBasketRecipes.recipeId}
                ${sql.join(whenClauses, sql` `)}
            END
        `

        // Update all matching recipes in the basket with their new servings
        await db
            .update(mealBasketRecipes)
            .set({
                plannedServings: servingsCaseStatement,
            })
            .where(
                and(
                    eq(mealBasketRecipes.mealBasketId, basketId),
                    inArray(mealBasketRecipes.recipeId, recipeIds),
                ),
            )
    }
}

// Export singleton instance
export const mealBasketRepository = new MealBasketRepository()
