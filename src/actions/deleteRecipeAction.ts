'use server'

import { db } from '@/db/drizzle'
import { recipes } from '@/db/schema'
import { requireAuth } from '@/lib/auth'
import { RecipeError } from '@/lib/data'
import { fetchUserId } from '@/lib/db'
import { eq } from 'drizzle-orm'
import { and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export async function deleteRecipeAction(id: string) {
    try {
        const user = await requireAuth()
        const userId = await fetchUserId(user.email)
        if (!userId) {
            throw new RecipeError('User not found')
        }
        await db.delete(recipes).where(and(eq(recipes.id, id)))
        revalidatePath('/recipes')
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
