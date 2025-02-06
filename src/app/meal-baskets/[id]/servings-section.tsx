'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form'
import { BasketWithRecipes } from '@/schemas/mealBasketsSchema'
import { updateServings } from '@/actions/MealBasketAction'
import { useActionState } from 'react'
import { z } from 'zod'
import { LoadingSpinner } from '@/components/ui/loadingspinner'
const ServingsFormSchema = z.record(z.string(), z.number())

type ServingsFormType = z.infer<typeof ServingsFormSchema>

export default function ServingsSection({
    basket,
}: {
    basket: BasketWithRecipes
}) {
    const recipes = basket.recipes
    const form = useForm<ServingsFormType>({
        resolver: zodResolver(ServingsFormSchema),
        defaultValues: Object.fromEntries(
            recipes.map((recipe) => [
                recipe.id,
                recipe.plannedServings || recipe.serving || 1,
            ]),
        ),
    })

    const updateServingsWithMealBasketId = updateServings.bind(null, basket.id)

    const [state, formAction, pending] = useActionState(
        updateServingsWithMealBasketId,
        {
            success: false,
            error: undefined,
        },
    )

    const handleServingsChange = (recipeId: string, change: number) => {
        const currentValue = form.getValues(recipeId) || 1
        const newValue = Math.max(1, currentValue + change)
        form.setValue(recipeId, newValue)
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="recipes">
                <AccordionTrigger>
                    <div className="flex justify-between w-full pr-4">
                        <span>Recipes and Servings</span>
                        <span>{recipes.length} recipes</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <Form {...form}>
                        <form action={formAction} className="space-y-4">
                            {recipes.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    className="flex items-center justify-between p-4 border rounded-lg"
                                >
                                    <div>
                                        <h3 className="font-semibold">
                                            {recipe.name}
                                        </h3>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleServingsChange(
                                                    recipe.id,
                                                    -1,
                                                )
                                            }
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <FormField
                                            control={form.control}
                                            name={recipe.id}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ) || 1,
                                                                )
                                                            }
                                                            className="w-16 text-center"
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() =>
                                                handleServingsChange(
                                                    recipe.id,
                                                    1,
                                                )
                                            }
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button
                                type="submit"
                                className="mt-4"
                                disabled={pending}
                            >
                                {pending ? (
                                    <LoadingSpinner />
                                ) : (
                                    'Save Planned Servings'
                                )}
                            </Button>
                        </form>
                    </Form>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )
}
