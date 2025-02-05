import { mealBasketRepository } from '../repositories/mealBasketRepository'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { NotFoundError, AuthError } from '@/lib/errors'
import { MealBasketForm } from '@/schemas/mealBasketsSchema'

export class MealBasketService {
    constructor(private repository = mealBasketRepository) {}

    private async getUserId() {
        const user = await requireAuth()
        const userId = await fetchUserId(user.email)
        if (!userId) throw new AuthError('User not found')
        return userId
    }

    async getMealBaskets() {
        const userId = await this.getUserId()
        return this.repository.getBaskets(userId)
    }

    async getMealBasket(id: string) {
        const userId = await this.getUserId()
        return this.repository.getBasketWithRecipes(id, userId)
    }

    async createMealBasket(data: MealBasketForm) {
        const userId = await this.getUserId()
        return this.repository.createBasket(data, userId)
    }

    async getServingsRecipes() {
        const userId = await this.getUserId()
        return this.repository.getServingsRecipes(userId)
    }

    async getAvailableRecipes(basketId: string) {
        const userId = await this.getUserId()
        return this.repository.getAvailableRecipes(basketId, userId)
    }

    async deleteMealBasket(id: string) {
        const userId = await this.getUserId()
        return this.repository.deleteBasket(id)
    }

    async addRecipeToBasket(basketId: string, recipeId: string) {
        const userId = await this.getUserId()
        return this.repository.addRecipeToBasket(basketId, recipeId)
    }

    async updateServings(basketId: string, servings: Record<string, number>) {
        const userId = await this.getUserId()
        return this.repository.updateServings(basketId, servings)
    }
}

export const mealBasketService = new MealBasketService()
