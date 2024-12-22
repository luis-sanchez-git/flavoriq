"use client"
import AddRecipeButton from "@/components/AddRecipeButton"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { newRecipeFormSchema } from "@/schemas/newRecipeSchema"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { useActionState } from "react"
import { createNewRecipe, CreateRecipeState } from "@/actions/newRecipeAction"
import { LoadingSpinner } from "@/components/ui/loadingspinner"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { CircleCheckBigIcon } from "lucide-react"
import { RecipeSchema } from "@/schemas/recipeSchema"

type CreateRecipeResultProps = CreateRecipeState & {
    isPending: boolean
}

function CreateRecipeResult({
    error,
    isSuccess,
    isPending,
}: CreateRecipeResultProps) {
    console.log("error", error, "isSuccess", isSuccess)
    if (isPending || (error === undefined && isSuccess === undefined)) {
        return null
    }

    const isError = isSuccess === false

    return (
        <Alert variant={isError ? "destructive" : "default"}>
            <AlertTitle>
                {isError ? (
                    <>Error Creating Recipe. Try Again.</>
                ) : (
                    <div className="flex gap-2 items-center">
                        <CircleCheckBigIcon className="text-green-500" />
                        Successfully created recipe
                    </div>
                )}
            </AlertTitle>
        </Alert>
    )
}

function RecipesPage() {
    const initialState: CreateRecipeState = {
        newRecipe: undefined,
        isSuccess: undefined,
        error: undefined,
    }
    const [createRecipeState, formAction, isPending] = useActionState(
        createNewRecipe,
        initialState,
    )

    console.log(createRecipeState.newRecipe)

    const form = useForm<RecipeSchema>({
        resolver: zodResolver(newRecipeFormSchema),
    })

    // useEffect(() => {}, [isPending, state.error])

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Recipes</h1>
            <Dialog>
                <DialogTrigger asChild>
                    <AddRecipeButton />
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add your recipe</DialogTitle>
                        <DialogDescription>
                            You can add your whole recipe here or provide the
                            name of popular recipes. When providing a recipe be
                            sure to at least include the name, ingredients,
                            steps.
                        </DialogDescription>
                        <Form {...form}>
                            <form action={formAction} className="space-y-8">
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
                                    {isPending ? <LoadingSpinner /> : "Create"}
                                </Button>
                            </form>
                        </Form>
                    </DialogHeader>
                    <DialogFooter>
                        <CreateRecipeResult
                            {...createRecipeState}
                            isPending={isPending}
                        />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default RecipesPage
