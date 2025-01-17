'use server'

import { db } from '@/db/drizzle'
import { mealBaskets } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { fetchUserId } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Define the shape of the state returned by the action
export type CreateMealBasketState = {
    isSuccess?: boolean
    error?: string
}

// Validation schema for the meal basket
const mealBasketSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string(),
})

// Helper to validate meal basket data
function validateMealBasket(formData: FormData) {
    const name = formData.get('name')
    const description = formData.get('description')
    return mealBasketSchema.safeParse({ name, description })
}

// Main action function
export async function createMealBasket(
    prevState: CreateMealBasketState,
    formData: FormData,
): Promise<CreateMealBasketState> {
    const respObj: CreateMealBasketState = { error: '', isSuccess: false }

    try {
        // Authenticate user
        const user = await requireAuth()

        // Validate form
        const validated = validateMealBasket(formData)
        if (!validated.success) {
            throw new Error('Invalid form data')
        }

        // Fetch user ID
        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new Error('User not found')
        }

        // Insert meal basket into database
        await db.insert(mealBaskets).values({
            name: validated.data.name,
            description: validated.data.description,
            userId,
        })

        respObj.isSuccess = true
        revalidatePath('/meal-baskets')
    } catch (error) {
        console.error('Error creating meal basket:', error)
        respObj.error = error instanceof Error ? error.message : 'Unknown error'
        respObj.isSuccess = false
    }

    return respObj
}
