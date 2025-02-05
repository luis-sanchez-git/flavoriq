import { recipeService } from '../services/recipeService'
import { requireAuth } from '@/lib/auth'

export class RecipesController {
    constructor(private service = recipeService) {}

    async getRecipesByUserId() {
        try {
            const user = await requireAuth()
            return await this.service.getRecipesByUserEmail(user.email)
        } catch (error) {
            throw new Error('Failed to fetch recipes')
        }
    }

    async getRecipe(id: string) {
        const recipes = await this.service.getRecipes([id])
        return recipes[0]
    }
}

export const recipesController = new RecipesController()
