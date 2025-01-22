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
import { useState, useEffect } from 'react'
import {
    newRecipeFormSchema,
    newRecipeFormType,
} from '@/schemas/newRecipeSchema'
import { useForm } from 'react-hook-form'
import {
    createNewRecipe,
    CreateRecipeState,
    checkRecipeStatus,
} from '@/actions/newRecipeAction'

type PendingRecipe = {
    id: string
    toastId: string
}

export function AddRecipeDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [pendingRecipes, setPendingRecipes] = useState<PendingRecipe[]>([])

    const form = useForm<newRecipeFormType>({
        resolver: zodResolver(newRecipeFormSchema),
    })

    useEffect(() => {
        if (pendingRecipes.length === 0) return

        const pollRecipes = async () => {
            const completedRecipes: string[] = []

            await Promise.all(
                pendingRecipes.map(async ({ id, toastId }) => {
                    const recipe = await checkRecipeStatus(id)

                    if (!recipe) {
                        toast.error('Failed to create recipe', {
                            id: `${toastId}-error`,
                        })
                        completedRecipes.push(id)
                    } else if (recipe.duration !== 'Processing...') {
                        toast.success('Recipe created successfully!', {
                            id: `${toastId}-success`,
                        })
                        completedRecipes.push(id)
                        router.refresh()
                    }
                }),
            )

            if (completedRecipes.length > 0) {
                setPendingRecipes((prev) =>
                    prev.filter(
                        (recipe) => !completedRecipes.includes(recipe.id),
                    ),
                )
            } else {
                setTimeout(pollRecipes, 2000)
            }
        }

        pollRecipes()
    }, [pendingRecipes, router])

    const onSubmit = async (formData: FormData) => {
        setIsPending(true)
        setOpen(false)
        const toastId = toast.loading('Creating your recipe...').toString()

        try {
            const result = await createNewRecipe({}, formData)
            console.log('result', result)

            if (result.recipeId) {
                setPendingRecipes((prev) => {
                    const recipeExists = prev.some(
                        (recipe) => recipe.id === result.recipeId,
                    )
                    if (recipeExists) {
                        return prev
                    }
                    return [...prev, { id: result.recipeId!, toastId }]
                })
                form.reset()
            } else if (result.error) {
                toast.error(`Failed to create recipe: ${result.error}`, {
                    id: toastId,
                })
            }
        } catch (error) {
            toast.error('An error occurred while creating the recipe.', {
                id: toastId,
            })
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
