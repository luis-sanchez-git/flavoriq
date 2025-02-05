import { z } from 'zod'
import { RecipeSchema } from './recipeSchema'

// Base schema for meal basket validation
export const MealBasketFormSchema = z.object({
    id: z.string().uuid().nullable(),
    name: z.string().min(1, 'Name is required'),
    description: z.string().nullable(),
})

// Schema for meal basket data
export const MealBasketSchema = MealBasketFormSchema.extend({
    id: z.string().uuid(),
    userId: z.string().uuid(),
})

// Schema for meal basket with recipes
export const BasketWithRecipesSchema = MealBasketSchema.extend({
    recipes: z.array(
        RecipeSchema.extend({
            plannedServings: z.number().int().min(1),
        }),
    ),
})

// Schema for adding recipe to basket
export const AddRecipeToBasketSchema = z.object({
    recipeId: z.string().uuid(),
    basketId: z.string().uuid(),
})

// Schema for updating servings
export const UpdateServingsSchema = z.record(
    z.string().uuid(),
    z.number().int().min(1),
)

// Export types
export type MealBasket = z.infer<typeof MealBasketSchema>
export type MealBasketForm = z.infer<typeof MealBasketFormSchema>
export type BasketWithRecipes = z.infer<typeof BasketWithRecipesSchema>
