"use server"

import { catchError } from "@/lib/utils"
import { newRecipeFormSchema } from "@/schemas/newRecipeSchema"
import { RecipeSchema } from "@/schemas/recipeSchema"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { RecipeType } from "@/schemas/recipeSchema"
import { auth } from "@/auth"
import { db } from "@/db/drizzle"
import { recipes } from "@/db/schema"

export type CreateRecipeState = {
    isSuccess?: boolean | undefined
    error?: string | undefined
}
const modelName = "gpt-4o-2024-08-06"

export async function createNewRecipe(
    prevState: CreateRecipeState,
    formData: FormData,
): Promise<CreateRecipeState> {
    const respObj: CreateRecipeState = {
        error: "",
        isSuccess: true,
    }
    // get the user
    const session = await auth()
    console.log(session)
    if (!session?.user) {
        respObj.error = "Unauthorized"
        respObj.isSuccess = false
        return respObj
    }
    // check if auth
    // verify shape (Zod)
    //
    const validatedFields = newRecipeFormSchema.safeParse({
        recipe: formData.get("recipe"),
    })

    if (!validatedFields.success) {
        respObj.isSuccess = false
        respObj.error = "invalid text"
        return respObj
    }

    // todo check for xss injection or some other issues
    const { recipe: recipePrompt } = validatedFields.data

    // make request
    // const generateErr = ""
    // const responseObj = ""
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
        return respObj
    }
    // validate response
    // const { object } = responseObj
    // db.insert(recipes).values({
    //     name: object.name,
    //     serving: object.serving,
    //     duration: object.duration,
    // })

    // save to DB

    respObj.isSuccess = true

    return respObj
}
