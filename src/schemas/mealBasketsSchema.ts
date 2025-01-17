import { z } from 'zod'

const mealBasketSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
})

export type MealBasket = z.infer<typeof mealBasketSchema>
