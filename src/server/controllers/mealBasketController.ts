import { mealBasketService } from '../services/mealBasketService'
import { NotFoundError, AuthError } from '@/lib/errors'

export class MealBasketController {
    constructor(private service = mealBasketService) {}

    async getMealBaskets() {
        try {
            return await this.service.getMealBaskets()
        } catch (error) {
            if (error instanceof AuthError) {
                throw error
            }
            throw new Error('Failed to fetch meal baskets')
        }
    }

    async getMealBasket(id: string) {
        try {
            return await this.service.getMealBasket(id)
        } catch (error) {
            if (error instanceof NotFoundError || error instanceof AuthError) {
                throw error
            }
            throw new Error('Failed to fetch meal basket')
        }
    }

    async getServingsRecipes() {
        try {
            return await this.service.getServingsRecipes()
        } catch (error) {
            if (error instanceof AuthError) {
                throw error
            }
            throw new Error('Failed to fetch servings recipes')
        }
    }

    async getAvailableRecipes(basketId: string) {
        try {
            return await this.service.getAvailableRecipes(basketId)
        } catch (error) {
            if (error instanceof AuthError) {
                throw error
            }
            throw new Error('Failed to fetch available recipes')
        }
    }
}

// Export singleton instance
export const mealBasketController = new MealBasketController()
