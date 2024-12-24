import { z } from "zod"

export const userSessionSchema = z.object({
    email: z.string().email(),
    name: z.string(),
})

export type UserSessionType = z.infer<typeof userSessionSchema>
