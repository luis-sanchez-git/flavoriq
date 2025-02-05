import { recipesController } from '@/server/controllers/recipesController'
import RecipeCard from './ui/recipe-card'

export default async function RecipeList() {
    const recipes = await recipesController.getRecipesByUserId()
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe.id} />
            ))}
        </div>
    )
}
