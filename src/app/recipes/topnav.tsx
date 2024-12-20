import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import SignIn from "./SignIn"

export default async function TopNav() {
    return (
        <NavigationMenu className="border-b-2 border-slate-200 ">
            <NavigationMenuList className="h-16  items-center bg-slate-100 relative justify-end flex w-screen px-2">
                <NavigationMenuItem>
                    <SignIn />{" "}
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}
