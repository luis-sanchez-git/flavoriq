import { z } from "zod"

export const RecipeSchema = z.object({
    name: z.string().describe("Name of the recipe"),
    ingredients: z.array(
        z.object({
            quantity: z.number().describe("quantity of the ingredient"),
            name: z
                .string()
                .describe(
                    "ingredient name and mentions ingredient measurement. (E.g. garlic cloves, cups onion, tsp garlic powder)",
                )
                .describe("list of ingredients"),
        }),
    ),
    steps: z
        .array(
            z.object({
                stepNumber: z.number().describe("the step number"),
                description: z
                    .string()
                    .describe("the step content and or description"),
            }),
        )
        .describe("steps of the recipe"),
    serving: z.number().describe("The amount of servings"),
    duration: z
        .string()
        .describe("How long it takes to make the recipe")
        .nonempty(),
})

export type RecipeType = z.infer<typeof RecipeSchema>
export type IngredientType = RecipeType["ingredients"][number]
export type StepType = RecipeType["steps"][number]
