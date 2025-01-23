import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { catchError } from './utils'
import {
    IngredientCategory,
    IngredientCategorySchema,
} from '@/schemas/recipeSchema'

const modelName = process.env.OPENAI_CATEGORIZE_MODEL!

// Schema for categorizing multiple ingredients at once

const CategorizedIngredientsSchema = z.object({
    categorizedIngredients: z.array(
        z.object({
            name: z.string(),
            category: IngredientCategorySchema,
        }),
    ),
})

type IngredientToCategorizeBatch = {
    name: string
    note?: string | null
}

export async function categorizeIngredientsBatch(
    ingredients: IngredientToCategorizeBatch[],
): Promise<IngredientCategory[]> {
    const ingredientList = ingredients
        .map((ing) => `${ing.name}${ing.note ? ` (${ing.note})` : ''}`)
        .join('\n')
    const [error, result] = await catchError(
        generateObject({
            model: openai(modelName),
            schema: CategorizedIngredientsSchema,
            prompt: `Categorize these ingredients into their respective categories:
            ${ingredientList}`,
        }),
    )

    if (error || !result) {
        console.error('Error categorizing ingredients:', error)
        // Return default category for all ingredients if there's an error
        return ingredients.map(() => 'Other')
    }

    const categorizedIngredients = result.object.categorizedIngredients

    // Create a map of ingredient names to their categories
    const categoryMap = new Map(
        categorizedIngredients.map((item) => [
            item.name.toLowerCase(),
            item.category,
        ]),
    )

    // Return categories in the same order as input ingredients
    return ingredients.map(
        (ing) =>
            (categoryMap.get(ing.name.toLowerCase()) ||
                'Other') as IngredientCategory,
    )
}
