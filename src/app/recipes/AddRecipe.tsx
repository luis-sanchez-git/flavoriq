import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import AddRecipeButton from "@/components/AddRecipeButton"
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
import { LoadingSpinner } from "@/components/ui/loadingspinner"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { CircleCheckBigIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"

import {
    newRecipeFormSchema,
    newRecipeFormType,
} from "@/schemas/newRecipeSchema"
import { useForm } from "react-hook-form"

import { useActionState } from "react"
import { createNewRecipe, CreateRecipeState } from "@/actions/newRecipeAction"

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

export function AddRecipeDialog() {
    const form = useForm<newRecipeFormType>({
        resolver: zodResolver(newRecipeFormSchema),
    })
    const initialState: CreateRecipeState = {
        isSuccess: undefined,
        error: undefined,
    }
    const [createRecipeState, formAction, isPending] = useActionState(
        createNewRecipe,
        initialState,
    )
    return (
        <Dialog>
            <DialogTrigger asChild>
                <AddRecipeButton />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add your recipe</DialogTitle>
                    <DialogDescription>
                        You can add your whole recipe here or provide the name
                        of popular recipes. When providing a recipe be sure to
                        at least include the name, ingredients, steps.
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
    )
}
