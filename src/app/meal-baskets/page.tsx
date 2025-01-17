import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { getMealBaskets } from '@/server/queries/meal-baskets'
import AddMealBasketDialog from './add-meal-basket-dialog'
import Link from 'next/link'

export default async function MealBasketsPage() {
    const baskets = await getMealBaskets()

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Meal Baskets</h1>
                <AddMealBasketDialog />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {baskets.map((basket) => (
                    <Link key={basket.id} href={`/meal-baskets/${basket.id}`}>
                        <Card className="relative hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                            <CardHeader>
                                <CardTitle>{basket.name}</CardTitle>
                                <CardDescription>
                                    {basket.description}
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
