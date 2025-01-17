import { getMealBaskets } from '@/server/queries/meal-baskets'
import AddMealBasketDialog from './add-meal-basket-dialog'
import BasketList from './basket-list'

export default async function MealBasketsPage() {
    const baskets = await getMealBaskets()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meal Baskets</h1>
                <AddMealBasketDialog />
            </div>
            <BasketList baskets={baskets} />
        </div>
    )
}
