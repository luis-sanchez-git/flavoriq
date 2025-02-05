import { RecipeType, RecipeStatus, RecipeSchema } from '@/schemas/recipeSchema'
import { recipesRepository } from '../repositories/recipesRepository'
import { categorizeIngredientsBatch } from '@/lib/categorizeIngredient'
import { revalidatePath } from 'next/cache'
import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { catchError } from '@/lib/utils'
import { fetchUserId } from '@/lib/db'

export class RecipeService {
    constructor(private repository = recipesRepository) {}

    private async generateRecipe(recipePrompt: string) {
        return catchError(
            generateObject({
                model: openai(process.env.OPENAI_CREATE_RECIPE_MODEL!),
                schema: RecipeSchema,
                prompt: `Recipe for ${recipePrompt}`,
            }),
        )
    }

    async createRecipe(
        recipe: string,
        userId: string,
    ): Promise<{ recipeId: string }> {
        // Create initial recipe record
        const recipeRecord = await this.repository.createInitialRecipe(
            recipe,
            userId,
        )

        // Start async recipe generation and processing
        void this.generateAndProcessRecipe(recipe, userId, recipeRecord.id)

        return { recipeId: recipeRecord.id }
    }

    private async generateAndProcessRecipe(
        recipePrompt: string,
        userId: string,
        recipeId: string,
    ) {
        try {
            // Generate recipe from OpenAI
            const [generateErr, responseObj] =
                await this.generateRecipe(recipePrompt)
            if (generateErr || !responseObj) {
                throw new Error('Failed to generate recipe')
            }

            const { object: newRecipe } = responseObj

            // Process the generated recipe
            await this.processRecipeCreation(newRecipe, userId, recipeId)
        } catch (error) {
            console.error('Error in recipe creation:', error)
            // Delete the recipe if generation failed
            await this.deleteRecipeOnError(recipeId, userId)
        }
    }

    async deleteRecipe(id: string, userId: string) {
        return this.repository.deleteRecipe(id, userId)
    }

    async getRecipe(id: string) {
        return this.repository.getRecipes([id])
    }

    async createInitialRecipe(recipe: string, userId: string) {
        return this.repository.createInitialRecipe(recipe, userId)
    }

    async processRecipeCreation(
        recipeData: RecipeType,
        userId: string,
        recipeId: string,
    ) {
        // Update recipe with generated data
        await this.repository.updateRecipeDetails(recipeId, {
            name: recipeData.name,
            serving: recipeData.serving,
            duration: recipeData.duration,
            status: 'DONE' as RecipeStatus,
        })

        // Insert ingredients without categories initially
        const ingredientInserts = recipeData.ingredients.map((ingredient) => ({
            recipeId,
            userId,
            name: ingredient.name,
            quantity: ingredient.quantity,
            unit: ingredient.unit || undefined,
            note: ingredient.note || undefined,
        }))

        const insertedIngredients =
            await this.repository.insertIngredients(ingredientInserts)

        // Insert steps
        const stepInserts = recipeData.steps.map((step) => ({
            recipeId,
            userId,
            stepNumber: step.stepNumber,
            description: step.description,
        }))
        await this.repository.insertSteps(stepInserts)

        // Start async categorization
        try {
            const categories = await categorizeIngredientsBatch(
                recipeData.ingredients.map((ing) => ({
                    name: ing.name,
                    note: ing.note,
                })),
            )

            await this.repository.updateIngredientCategories(
                insertedIngredients.map((ing, index) => ({
                    id: ing.id,
                    category: categories[index],
                })),
            )
            revalidatePath('/recipes')
        } catch (error) {
            console.error('Error categorizing ingredients:', error, {
                recipeId,
                ingredientIds: insertedIngredients.map((ing) => ing.id),
            })
        }
    }

    async getRecipeStatus(recipeId: string) {
        return this.repository.getRecipes([recipeId])
    }

    async deleteRecipeOnError(recipeId: string, userId: string) {
        await this.repository.deleteRecipe(recipeId, userId)
    }

    async updateRecipe(
        recipeId: string,
        userId: string,
        updatedRecipe: RecipeType,
    ) {
        // Update main recipe details through repository
        await this.repository.updateFullRecipe(recipeId, userId, updatedRecipe)

        // Start categorization after main updates complete
        try {
            const categories = await categorizeIngredientsBatch(
                updatedRecipe.ingredients.map((ing) => ({
                    name: ing.name,
                    note: ing.note,
                })),
            )

            const insertedIngredients =
                await this.repository.getRecipeIngredients(recipeId)

            await this.repository.updateIngredientCategories(
                insertedIngredients.map((ing, index) => ({
                    id: ing.id,
                    category: categories[index],
                })),
            )
            revalidatePath(`/recipes/${recipeId}`)
        } catch (error) {
            console.error('Error categorizing ingredients:', error)
        }

        revalidatePath(`/recipes/${recipeId}`)
    }

    async getRecipes(recipeIds: string[]) {
        return this.repository.getRecipes(recipeIds, {})
    }

    async getRecipesByUserEmail(userEmail: string) {
        const userId = await fetchUserId(userEmail)
        if (!userId) {
            throw new Error('User not found')
        }
        return this.repository.getRecipes([], { userId })
    }
}

export const recipeService = new RecipeService()
