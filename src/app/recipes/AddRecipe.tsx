'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import AddRecipeButton from '@/components/AddRecipeButton'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
    newRecipeFormSchema,
    newRecipeFormType,
} from '@/schemas/newRecipeSchema'
import { useForm } from 'react-hook-form'
import { createNewRecipe } from '@/actions/newRecipeAction'

export function AddRecipeDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    const form = useForm<newRecipeFormType>({
        resolver: zodResolver(newRecipeFormSchema),
    })

    const onSubmit = async (formData: FormData) => {
        setIsPending(true)
        setOpen(false)
        const toastId = toast.loading('Creating your recipe...')

        try {
            const result = await createNewRecipe({}, formData)

            if (result.isSuccess) {
                toast.success('Recipe created successfully!', {
                    id: toastId,
                })
                router.refresh()
            } else {
                toast.error(`Failed to create recipe: ${result.error}`, {
                    id: toastId,
                })
            }
        } finally {
            setIsPending(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <AddRecipeButton />
            </DialogTrigger>
            <DialogContent className="min-w-fit max-h-svh overflow-auto">
                <DialogHeader>
                    <DialogTitle>Add your recipe</DialogTitle>
                    <DialogDescription>
                        You can add your whole recipe here or provide the name
                        of popular recipes. When providing a recipe be sure to
                        at least include the name, ingredients, steps.
                    </DialogDescription>
                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                onSubmit(formData)
                            }}
                            className="space-y-8"
                        >
                            <FormField
                                control={form.control}
                                name="recipe"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Recipe</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                disabled={isPending}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Recipe Details or Name of Recipe
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                className="w-full text-center"
                                type="submit"
                                disabled={isPending}
                            >
                                Create
                            </Button>
                        </form>
                    </Form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
