'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useActionState } from 'react'
import { createMealBasket } from '@/actions/newMealBasketAction'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { z } from 'zod'
import { PlusCircle } from 'lucide-react'

interface AddMealBasketDialogProps {
    isOpen: boolean
    onClose: () => void
}

const mealBasketFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    description: z.string().optional(),
})

type MealBasketFormType = z.infer<typeof mealBasketFormSchema>

export default function AddMealBasketDialog() {
    const [open, setOpen] = useState(false)
    const form = useForm<MealBasketFormType>({
        resolver: zodResolver(mealBasketFormSchema),
        defaultValues: {
            name: '',
            description: '',
        },
    })

    const [state, formAction, isPending] = useActionState(createMealBasket, {
        isSuccess: false,
        error: '',
    })

    return (
        <>
            <Button onClick={() => setOpen(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Basket
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Meal Basket</DialogTitle>
                        <DialogDescription>
                            Create a new meal basket to group your favorite
                            recipes.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form action={formAction} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Basket Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isPending}
                                                placeholder="Enter basket name"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={isPending}
                                                placeholder="Enter basket description"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full"
                            >
                                {isPending ? 'Adding...' : 'Add Basket'}
                            </Button>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </>
    )
}
