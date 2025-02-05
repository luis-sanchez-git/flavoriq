'use client'

import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { Trash2Icon } from 'lucide-react'
import Link from 'next/link'
import { deleteMealBasket } from '@/actions/MealBasketAction'
import { MealBasket } from '@/schemas/mealBasketsSchema'

type BasketListProps = {
    baskets: MealBasket[]
}

export default function BasketList({ baskets }: BasketListProps) {
    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await deleteMealBasket(id)
        } catch (error) {
            console.error('Error deleting meal basket:', error)
        }
    }

    return (
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
                        <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            onClick={(e) => handleDelete(e, basket.id)}
                        >
                            <Trash2Icon className="w-4 h-4" />
                        </Button>
                    </Card>
                </Link>
            ))}
        </div>
    )
}
