import { z } from 'zod'

export const promptRecipeSchema = z.object({
    prompt: z.string().trim().min(1, 'text area cannot be empty').max(50),
})

export type promptRecipeType = z.infer<typeof promptRecipeSchema>
