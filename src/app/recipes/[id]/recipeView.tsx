import { RecipeType } from '@/schemas/recipeSchema'
import { ScaleServings } from './scaleServings'

export const RecipeView = ({ recipe }: { recipe: RecipeType }) => {
    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScaleServings recipe={recipe} />
                <div>
                    <h2 className="text-2xl font-semibold mb-4">Details</h2>
                    <p>
                        <strong>Servings:</strong> {recipe.serving}
                    </p>
                    <p>
                        <strong>Preparation Time:</strong> {recipe.duration}
                    </p>
                </div>
            </div>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Instructions</h2>
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
        </>
    )
}
