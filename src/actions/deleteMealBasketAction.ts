'use server'

import { db } from '@/db/drizzle'
import { mealBaskets } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/lib/data'
import { fetchUserId } from '@/lib/db'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function deleteMealBasketAction(id: string) {
    try {
        const user = await requireAuth()
        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new RecipeError('User not found')
        }

        await db.delete(mealBaskets).where(and(eq(mealBaskets.id, id)))
        revalidatePath('/meal-baskets')
        return { success: true }
    } catch (e) {
        if (e instanceof RecipeError) {
            console.error(`[RecipeError]: ${e.message}`, {
                details: e.details,
            })
        } else {
            console.error(`[UnhandledError]: ${e}`)
        }
        return { success: false }
    }
}
