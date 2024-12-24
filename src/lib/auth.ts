import { auth } from "@/auth"
import { userSessionSchema, UserSessionType } from "@/schemas/authSchema"

export async function requireAuth(): Promise<UserSessionType> {
    const errorMessage = "Unauthorized"
    const session = await auth()
    if (!session?.user) throw new Error(errorMessage)

    const { user } = session

    const validations = userSessionSchema.safeParse(user)

    if (!validations.success) {
        throw new Error(errorMessage)
    }

    return validations.data
}
