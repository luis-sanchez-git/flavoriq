import { z } from 'zod'
import { RecipeSchema } from './recipeSchema'

const mealBasketSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
})

export type MealBasket = z.infer<typeof mealBasketSchema>

const basketWithRecipesSchema = z.object({
    id: z.string(),
    name: z.string(),
    recipes: z.array(
        RecipeSchema.extend({
            plannedServings: z.number(),
        }),
    ),
})

export type BasketWithRecipes = z.infer<typeof basketWithRecipesSchema>
