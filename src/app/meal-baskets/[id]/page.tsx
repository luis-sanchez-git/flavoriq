import { getMealBasket, getUserRecipes } from '@/server/queries/meal-baskets'
import AddRecipeToBasket from './add-recipe-to-basket'
import ServingsList from './servings-list'

type Params = Promise<{ id: string }>
export default async function MealBasketPage(props: { params: Params }) {
    const params = await props.params

    const basket = await getMealBasket(params.id)
    const recipes = await getUserRecipes()

    return (
        <div className="container mx-auto px-4 py-8 h-full">
            <h1 className="text-2xl font-bold">{basket.name}</h1>
            <AddRecipeToBasket recipes={recipes} basketId={params.id} />
            <ServingsList recipes={recipes} />
        </div>
    )
}
