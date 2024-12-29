import RecipeList from '@/components/RecipeList'
import { AddRecipeDialog } from './AddRecipe'

function RecipesPage() {
    return (
        <div>
            <AddRecipeDialog />
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
