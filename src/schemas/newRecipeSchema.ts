import { z } from 'zod'

export const newRecipeFormSchema = z.object({
    recipe: z
        .string()
        .trim()
        .min(1, 'text area cannot be empty')
        .max(500, 'text exceeds max length of 500 characters'),
})

export type newRecipeFormType = z.infer<typeof newRecipeFormSchema>
