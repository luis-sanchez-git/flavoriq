import { z } from "zod"

export const RecipeSchema = z.object({
    name: z.string().describe("Name of the recipe"),
    ingredients: z.array(
        z.object({
            quantity: z.number().describe("quantity of the ingredient"),
            ingredient: z
                .string()
                .describe(
                    "ingredient name and mentions ingredient measurement. (E.g. garlic cloves, cups onion, tsp garlic powder)",
                )
                .describe("list of ingredients"),
        }),
    ),
    steps: z
        .array(
            z.string().describe("markdown content to describe the recipe step"),
        )
        .describe("steps of the recipe"),
    serving: z.number().describe("The amount of servings"),
    duration: z.string().describe("How long it takes to make the recipe"),
})

export type RecipeType = z.infer<typeof RecipeSchema>
