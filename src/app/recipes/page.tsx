import RecipeList from '@/components/RecipeList'
import { AddRecipeDialog } from './AddRecipe'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShoppingBasket } from 'lucide-react'

function RecipesPage() {
    return (
        <div className="w-full">
            <div className="flex gap-2 mb-4">
                <AddRecipeDialog />
                <Link href="/meal-baskets">
                    <Button variant="outline">
                        <ShoppingBasket className="mr-2 h-4 w-4" />
                        Meal Baskets
                    </Button>
                </Link>
            </div>
            <h1
                data-testid="recipes-page-header"
                className="text-3xl font-bold mb-6"
            >
                Recipes
            </h1>
            <RecipeList />
        </div>
    )
}
export default RecipesPage
