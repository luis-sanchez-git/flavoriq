import { db } from "@/db/drizzle"
import { users } from "@/db/schema"
import { eq } from "drizzle-orm"

// Helper to fetch user ID
export async function fetchUserId(
    email: string | undefined,
): Promise<string | null> {
    if (!email) return null
    const user = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.email, email))
        .limit(1)

    return user[0]?.id || null
}
