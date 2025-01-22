import { z } from 'zod'

export const IngredientCategorySchema = z
    .enum([
        'Produce',
        'Meat & Seafood',
        'Dairy & Eggs',
        'Pantry',
        'Frozen',
        'Other',
    ])
    .describe('category of the ingredient')

export type IngredientCategory = z.infer<typeof IngredientCategorySchema>

export const RecipeSchema = z.object({
    id: z.string().describe('The id of the recipe'),
    name: z.string().describe('Name of the recipe'),
    ingredients: z.array(
        z.object({
            id: z.string().describe('The id of the ingredient'),
            quantity: z.number().describe('quantity of the ingredient'),
            unit: z
                .string()
                .describe(
                    'unit of the ingredient in singular form (e.g. cup, tbsp,etc.',
                )
                .optional(),
            name: z
                .string()
                .describe('ingredient name in singular form. (E.g. garlic)')
                .describe('list of ingredients'),
            note: z.string().describe('note of the ingredient').optional(),
            category: IngredientCategorySchema,
        }),
    ),
    steps: z
        .array(
            z.object({
                id: z.string().describe('the step id'),
                stepNumber: z.number().describe('the step number'),
                description: z
                    .string()
                    .describe('the step content and or description'),
            }),
        )
        .describe('steps of the recipe'),
    serving: z.number().describe('The amount of servings'),
    duration: z
        .string()
        .describe('How long it takes to make the recipe')
        .nonempty(),
})

export type RecipeType = z.infer<typeof RecipeSchema>
export type IngredientType = RecipeType['ingredients'][number]
export type StepType = RecipeType['steps'][number]
