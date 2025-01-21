import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'
import { ingredientCategories } from '@/db/schema'

const CategorySchema = z.object({
    category: z.enum(ingredientCategories),
})

export async function categorizeIngredient(name: string, note?: string | null) {
    const result = await generateObject({
        model: openai('gpt-4o-mini', {
            structuredOutputs: true,
        }),
        schema: CategorySchema,
        schemaName: 'ingredientCategory',
        schemaDescription:
            'Categorize a recipe ingredient into predefined categories',
        prompt: `Categorize this ingredient into one of these categories: ${ingredientCategories.join(', ')}
    
Ingredient: ${name}${note ? `\nNote: ${note}` : ''}`,
    })

    return result.object.category
}
