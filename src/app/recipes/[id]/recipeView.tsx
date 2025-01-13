'use client'

import { useState } from 'react'
import { RecipeType } from '@/schemas/recipeSchema'
import { scaleIngredient } from './scaleServingsUtil'
import { Button } from '@/components/ui/button'
import CookingMode from './cooking-mode'
import { ChefHat, Edit } from 'lucide-react'
import { ScaleServings } from './scaleServings'
import { EditRecipeForm } from './editRecipeForm'

export const RecipeView = ({ recipe }: { recipe: RecipeType }) => {
    const [isCookingMode, setIsCookingMode] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [servingScale, setServingScale] = useState(1)

    const scaledRecipe = {
        ...recipe,
        ingredients: recipe.ingredients.map((ingredient) =>
            scaleIngredient(ingredient, recipe.serving, servingScale),
        ),
    }

    if (isEditing) {
        return (
            <EditRecipeForm
                recipe={recipe}
                onCancel={() => setIsEditing(false)}
            />
        )
    }

    if (isCookingMode) {
        return (
            <CookingMode
                recipe={scaledRecipe}
                onExit={() => setIsCookingMode(false)}
            />
        )
    }

    return (
        <>
            <div className="flex justify-between items-center gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-semibold mb-4">Details</h2>
                    </div>
                    <p>
                        <strong>Original Servings:</strong> {recipe.serving}
                    </p>
                    <p>
                        <strong>Preparation Time:</strong> {recipe.duration}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsEditing(true)}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setIsCookingMode(true)}
                        className="flex items-center gap-2"
                    >
                        <ChefHat className="h-5 w-5" />
                        Enter Cooking Mode
                    </Button>
                </div>
            </div>

            <div className="flex gap-6">
                <div className="flex gap-8">
                    <ScaleServings
                        recipe={recipe}
                        onScaleChange={setServingScale}
                        currentScale={servingScale}
                    />
                </div>

                <div>
                    <h2 className="text-2xl font-semibold mb-4">
                        Instructions
                    </h2>
                    <ol className="list-decimal pl-5 space-y-4">
                        {recipe.steps
                            .sort((a, b) => a.stepNumber - b.stepNumber)
                            .map((step, index) => (
                                <li key={index} className="pl-2">
                                    {step.description}
                                </li>
                            ))}
                    </ol>
                </div>
            </div>
        </>
    )
}
