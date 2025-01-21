import { ingredientCategories } from '@/db/schema'
import { scaleIngredient } from '@/app/recipes/[id]/scaleServingsUtil'
import { BasketWithRecipes } from '@/schemas/mealBasketsSchema'

export default function BasketIngredients({
    basket,
}: {
    basket: BasketWithRecipes
}) {
    // Collect and scale all ingredients from all recipes
    const scaledIngredients = basket.recipes.flatMap((recipe) =>
        recipe.ingredients.map((ing) =>
            scaleIngredient(ing, recipe.serving, recipe.plannedServings),
        ),
    )

    // Group ingredients by category
    const categorizedIngredients = ingredientCategories.reduce(
        (acc, category) => {
            acc[category] = scaledIngredients.filter(
                (ing) => ing.category === category,
            )
            return acc
        },
        {} as Record<
            (typeof ingredientCategories)[number],
            typeof scaledIngredients
        >,
    )

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Basket Ingredients</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ingredientCategories.map((category) => (
                    <div
                        key={category}
                        className="bg-white rounded-lg shadow p-4"
                    >
                        <h3 className="font-medium text-lg mb-3">{category}</h3>
                        <ul className="space-y-2">
                            {categorizedIngredients[category].map(
                                (ingredient, index) => (
                                    <li key={index} className="text-gray-700">
                                        {ingredient.quantity && ingredient.unit
                                            ? `${ingredient.quantity} ${ingredient.unit} `
                                            : ''}
                                        {ingredient.name}
                                    </li>
                                ),
                            )}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    )
}
