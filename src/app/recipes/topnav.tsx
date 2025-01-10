import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from '@/components/ui/navigation-menu'
import SignIn from './SignIn'

export default async function TopNav() {
    return (
        <NavigationMenu className="w-full bg-slate-100 border-b-2 border-slate-200">
            <div className="max-w-[1800px] mx-auto w-full">
                <NavigationMenuList className="flex justify-between h-16 px-5">
                    <NavigationMenuItem>
                        <h1 className="text-4xl font-bold">FlavorIQ</h1>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <SignIn />
                    </NavigationMenuItem>
                </NavigationMenuList>
            </div>
        </NavigationMenu>
    )
}
