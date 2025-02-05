import { mealBasketController } from '@/server/controllers/mealBasketController'
import AddMealBasketDialog from './add-meal-basket-dialog'
import BasketList from './basket-list'

export default async function MealBasketsPage() {
    const baskets = await mealBasketController.getMealBaskets()

    return (
        <div className="mx-auto py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meal Baskets</h1>
                <AddMealBasketDialog />
            </div>
            <BasketList baskets={baskets} />
        </div>
    )
}
