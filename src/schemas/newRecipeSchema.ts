import { z } from "zod"

export const newRecipeFormSchema = z.object({
    recipe: z
        .string()
        .trim()
        .min(1, "text area cannot be empty")
        .max(50, "text exceeds max length of 10,000 characters"),
})
