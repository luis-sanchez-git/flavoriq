import Link from 'next/link'
import { RecipeType } from '@/schemas/recipeSchema'
import { getRecipes } from '@/lib/data'

interface RecipeListProps {
    recipes: RecipeType[]
}

export default async function RecipeList() {
    const recipes = await getRecipes()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recipes.map((recipe) => (
                <Link
                    href={`/recipes/${recipe.id}`}
                    key={recipe.id}
                    className="block"
                >
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">
                            {recipe.name}
                        </h2>
                        <p className="text-gray-600">{recipe.duration}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
