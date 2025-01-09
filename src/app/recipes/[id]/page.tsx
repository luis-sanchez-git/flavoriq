import { notFound } from 'next/navigation'
import { RecipeType } from '@/schemas/recipeSchema'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getRecipe } from '@/lib/data'
import RecipePrompt from './recipePrompt'

type Params = Promise<{ id: string }>

export default async function RecipePage(props: { params: Params }) {
    const params = await props.params
    const recipe: RecipeType = await getRecipe(params.id)
    if (!recipe) {
        notFound()
    }

    return (
        <div className="container gap-4 flex flex-col">
            <RecipePrompt recipe={recipe} />
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">
                        {recipe.name}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Ingredients
                            </h2>
                            <ul className="list-disc pl-5 space-y-2">
                                {recipe.ingredients.map((ingredient, index) => (
                                    <li key={index}>
                                        {ingredient.quantity} {ingredient.unit}{' '}
                                        {ingredient.name}{' '}
                                        {ingredient.note && (
                                            <span className="text-gray-500">
                                                ({ingredient.note})
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Details
                            </h2>
                            <p>
                                <strong>Servings:</strong> {recipe.serving}
                            </p>
                            <p>
                                <strong>Preparation Time:</strong>{' '}
                                {recipe.duration}
                            </p>
                        </div>
                    </div>
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">
                            Instructions
                        </h2>
                        <ol className="list-decimal pl-5 space-y-4">
                            {recipe.steps
                                .sort((a, b) => a.stepNumber - b.stepNumber)
                                .map((step, index) => (
                                    <li key={index} className="pl-2">
                                        <span className="font-medium"></span>{' '}
                                        {step.description}
                                    </li>
                                ))}
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
