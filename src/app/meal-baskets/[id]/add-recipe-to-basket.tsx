'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { addRecipeToBasket } from './actions'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { FormField } from '@/components/ui/form'
import { PlusCircle } from 'lucide-react'
import { RecipeType } from '@/schemas/recipeSchema'

const FormSchema = z.object({
    recipeId: z.string().min(1, 'Please select a recipe'),
})

type AvailableRecipe = {
    id: string
    name: string
}

export default function AddRecipeToBasket({
    availableRecipes,
    basketId,
}: {
    availableRecipes: AvailableRecipe[]
    basketId: string
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })
    const [open, setOpen] = useState(false)
    const params = useParams()

    const handleAddRecipeToBasket = async () => {
        await addRecipeToBasket(basketId, form.getValues('recipeId'))
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="w-4 h-4" /> Add Recipe
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Recipe to Meal Basket</DialogTitle>
                    <DialogDescription>
                        Select a recipe to add to your meal basket.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={handleAddRecipeToBasket}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="recipeId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            {...field}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a recipe" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRecipes.map(
                                                    (recipe) => (
                                                        <SelectItem
                                                            key={recipe.id}
                                                            value={recipe.id}
                                                        >
                                                            {recipe.name}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Add Recipe</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
