import { auth, signIn, signOut } from "@/auth"

export default async function SignIn() {
    const session = await auth()

    const user = session?.user

    return (
        <form
            action={async () => {
                "use server"
                if (user) await signOut({ redirectTo: "/" })
                else await signIn(undefined, { redirectTo: "/recipes" })
            }}
        >
            {<button type="submit">{user ? "Sign Out" : "Sign In"}</button>}
        </form>
    )
}
