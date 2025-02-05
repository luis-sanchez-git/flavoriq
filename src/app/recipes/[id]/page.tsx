import { notFound } from 'next/navigation'
import { RecipeType } from '@/schemas/recipeSchema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { recipesController } from '@/server/controllers/recipesController'
import RecipePrompt from './recipePrompt'
import { RecipeView } from './recipeView'

type Params = Promise<{ id: string }>

export default async function RecipePage(props: { params: Params }) {
    const params = await props.params
    const recipe: RecipeType = await recipesController.getRecipe(params.id)
    if (!recipe) {
        notFound()
    }

    return (
        <div className="container gap-4 flex flex-col h-full">
            <RecipePrompt recipe={recipe} />
            <Card className="h-full flex flex-col">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        {recipe.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <RecipeView recipe={recipe} />
                </CardContent>
            </Card>
        </div>
    )
}
