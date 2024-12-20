import { auth, signIn, signOut } from "@/auth"
import { Button } from "@/components/ui/button"
import { LogInIcon, LogOutIcon } from "lucide-react"

const SignInMsg = () => {
    return (
        <>
            Sign In
            <LogInIcon />
        </>
    )
}

const SignOutMsg = () => {
    return (
        <>
            Sign Out
            <LogOutIcon />
        </>
    )
}

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
            {
                <Button type="submit">
                    {user ? <SignOutMsg /> : <SignInMsg />}
                </Button>
            }
        </form>
    )
}
