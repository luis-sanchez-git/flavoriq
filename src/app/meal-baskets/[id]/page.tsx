import { mealBasketController } from '@/server/controllers/mealBasketController'
import AddRecipeToBasket from './add-recipe-to-basket'
import ServingsSection from './servings-section'
import BasketIngredients from './basket-ingredients'

type Params = Promise<{ id: string }>
export default async function MealBasketPage(props: { params: Params }) {
    const params = await props.params

    const [basket, availableRecipes] = await Promise.all([
        mealBasketController.getMealBasket(params.id),
        mealBasketController.getAvailableRecipes(params.id),
    ])

    return (
        <div className="container mx-auto px-4 py-8 h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{basket.name}</h1>
                <AddRecipeToBasket
                    availableRecipes={availableRecipes}
                    basketId={params.id}
                />
            </div>
            <ServingsSection basket={basket} />
            <BasketIngredients basket={basket} />
        </div>
    )
}
