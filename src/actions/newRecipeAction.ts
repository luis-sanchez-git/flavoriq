"use server"

import { catchError } from "@/lib/utils"
import { newRecipeFormSchema } from "@/schemas/newRecipeFormSchema"
import { RecipeSchema } from "@/schemas/recipeSchema"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { RecipeType } from "@/schemas/recipeSchema"

export type CreateRecipeState = {
    isSuccess?: boolean | undefined
    error?: string | undefined
}
const modelName = "gpt-4o-2024-08-06"

export async function createNewRecipe(
    prevState: CreateRecipeState,
    formData: FormData,
): Promise<CreateRecipeState> {
    // check if auth
    // verify shape (Zod)
    //
    const validatedFields = newRecipeFormSchema.safeParse({
        recipe: formData.get("recipe"),
    })
    const respObj: CreateRecipeState = {
        error: "",
        isSuccess: true,
    }

    if (!validatedFields.success) {
        respObj.isSuccess = false
        respObj.error = "invalid text"
        return respObj
    }

    // todo check for xss injection or some other issues
    const { recipe: recipePrompt } = validatedFields.data

    // make request
    const [generateErr, responseObj] = await catchError(
        generateObject({
            model: openai(modelName),
            schema: RecipeSchema,
            prompt: `Recipe for ${recipePrompt}`,
        }),
    )

    if (generateErr || !responseObj) {
        respObj.error = "Something went wrong"
        respObj.isSuccess = false
    }

    // save to DB

    respObj.isSuccess = true

    return respObj
}
