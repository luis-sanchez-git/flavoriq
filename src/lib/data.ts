import { db } from '@/db/drizzle'
import { recipeIngredients, recipes, steps } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { IngredientType, RecipeType, StepType } from '@/schemas/recipeSchema'
import { and, eq } from 'drizzle-orm'
import { catchError } from './utils'
import { z } from 'zod'

class GetRecipeError extends Error {
    details?: any

    constructor(message: string, details?: any) {
        super(message)
        this.details = details
    }
}

type JoinedRecipe = {
    recipeId: string
    recipeName: string
    serving: number
    duration: string
    ingredientId: string | null
    ingredientName: string | null
    ingredientQuantity: number | null
    stepId: string | null
    stepNumber: number | null
    stepDescription: string | null
    ingredientUnit: string | null
    ingredientNote: string | null
}

type ExtendedRecipeType = RecipeType & {
    ingredientIds?: Set<string>
    stepIds?: Set<string>
}

const StepSchema = z.object({
    id: z.string(),
    stepNumber: z.number(),
    description: z.string(),
})

const IngredientSchema = z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    unit: z.string().optional(),
    note: z.string().optional(),
})

function validateStep(stepData: JoinedRecipe): StepType | null {
    const parsed = StepSchema.safeParse({
        id: stepData.stepId,
        stepNumber: stepData.stepNumber,
        description: stepData.stepDescription,
    })
    return parsed.success ? parsed.data : null
}

function validateIngredient(
    ingredientData: JoinedRecipe,
): IngredientType | null {
    const parsed = IngredientSchema.safeParse({
        id: ingredientData.ingredientId,
        name: ingredientData.ingredientName,
        quantity: ingredientData.ingredientQuantity,
        unit: ingredientData.ingredientUnit,
    })
    return parsed.success ? parsed.data : null
}

function formatRecipes(recipeData: JoinedRecipe[]) {
    const recipesMap = new Map<string, ExtendedRecipeType>()
    recipeData.forEach((row) => {
        const { recipeId, recipeName, serving, duration } = row

        const entryExists = recipesMap.has(recipeId)
        if (!entryExists) {
            recipesMap.set(recipeId, {
                id: recipeId,
                name: recipeName,
                serving,
                duration,
                ingredients: [],
                steps: [],
                ingredientIds: new Set(),
                stepIds: new Set(),
            })
        }

        const recipe = recipesMap.get(recipeId)!

        // Add ingredient if it exists
        // TODO: Here  we are adding ingredients, but we should only be adding non duplicates
        // same for Steps

        const ingredientIds = recipe.ingredientIds!
        const stepIds = recipe.stepIds!

        const step = validateStep(row)
        if (step && !stepIds.has(step.id)) {
            recipe.steps.push(step)
            stepIds.add(step.id)
        }

        const ingredient = validateIngredient(row)
        if (ingredient && !ingredientIds.has(ingredient.id)) {
            recipe.ingredients.push(ingredient)
            ingredientIds.add(ingredient.id)
        }
    })

    return [...recipesMap.values()].map((recipe) => {
        delete recipe.ingredientIds
        delete recipe.stepIds
        return recipe
    })
}

type GetRecipeFilter = {
    recipeId?: string
}

export async function getRecipes(filters?: GetRecipeFilter) {
    try {
        const user = await requireAuth()

        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new GetRecipeError('User not found')
        }

        const where = [eq(recipes.userId, userId)]
        if (filters?.recipeId) where.push(eq(recipes.id, filters.recipeId))

        const recipeData = await db
            .select({
                recipeId: recipes.id,
                recipeName: recipes.name,
                serving: recipes.serving,
                duration: recipes.duration,
                ingredientId: recipeIngredients.id,
                ingredientName: recipeIngredients.name,
                ingredientNote: recipeIngredients.note,
                ingredientQuantity: recipeIngredients.quantity,
                ingredientUnit: recipeIngredients.unit,
                stepId: steps.id,
                stepNumber: steps.stepNumber,
                stepDescription: steps.description,
            })
            .from(recipes)
            .leftJoin(
                recipeIngredients,
                eq(recipes.id, recipeIngredients.recipeId),
            )
            .leftJoin(steps, eq(recipes.id, steps.recipeId))
            .where(and(...where))
        return formatRecipes(recipeData)
    } catch (e) {
        if (e instanceof GetRecipeError) {
            console.error(`[GetRecipeError]: ${e.message}`, {
                details: e.details,
            })
        } else {
            console.error(`[UnhandledError]: ${e}`)
        }
        throw new GetRecipeError('Failed to fetch recipes', e)
    }
}

export async function getRecipe(id: string) {
    const [error, recipes] = await catchError(getRecipes({ recipeId: id }))
    if (error || !recipes?.length) {
        throw new GetRecipeError('Recipe not found', { recipeId: id })
    }
    return recipes[0]
}
