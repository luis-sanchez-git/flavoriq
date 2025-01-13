'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { RecipeType } from '@/schemas/recipeSchema'

interface CookingModeProps {
    recipe: RecipeType
    onExit: () => void
}

const bgColors = [
    'bg-yellow-100 dark:bg-yellow-900',
    'bg-green-100 dark:bg-green-900',
    'bg-blue-100 dark:bg-blue-900',
    'bg-pink-100 dark:bg-pink-900',
    'bg-purple-100 dark:bg-purple-900',
    'bg-orange-100 dark:bg-orange-900',
    'bg-teal-100 dark:bg-teal-900',
    'bg-red-100 dark:bg-red-900',
]

export default function CookingMode({ recipe, onExit }: CookingModeProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0)

    const currentStep = recipe.steps[currentStepIndex]

    const ingredientColors = useMemo(() => {
        return recipe.ingredients.reduce(
            (acc, ingredient, index) => {
                acc[ingredient.name.toLowerCase()] =
                    bgColors[index % bgColors.length]
                return acc
            },
            {} as Record<string, string>,
        )
    }, [recipe.ingredients])

    const highlightIngredients = (ingredients: string[], step: string) => {
        const stepWords = step.toLowerCase().split(/\b/)
        return ingredients.map((ingredient, index) => {
            const ingredientWords = ingredient.toLowerCase().split(/\b/)
            const isHighlighted = ingredientWords.some(
                (word) => word.length > 1 && stepWords.includes(word),
            )
            return (
                <li
                    key={index}
                    className={
                        isHighlighted
                            ? `font-semibold underline decoration-2 underline-offset-4 ${ingredientColors[ingredient.toLowerCase()]}`
                            : ''
                    }
                >
                    {ingredient}
                </li>
            )
        })
    }

    const highlightStep = (step: string, ingredients: string[]) => {
        const words = step.split(/\b/)
        const ingredientWords = ingredients.reduce(
            (acc, ingredient) => {
                ingredient
                    .toLowerCase()
                    .split(/\b/)
                    .forEach((word) => {
                        if (word.length > 1) {
                            acc[word] =
                                ingredientColors[ingredient.toLowerCase()]
                        }
                    })
                return acc
            },
            {} as Record<string, string>,
        )

        return words.map((word, index) => {
            const bgColor = ingredientWords[word.toLowerCase()]
            return bgColor ? (
                <span
                    key={index}
                    className={`font-semibold underline decoration-2 underline-offset-4 ${bgColor}`}
                >
                    {word}
                </span>
            ) : (
                <span key={index}>{word}</span>
            )
        })
    }

    const goToPreviousStep = useCallback(() => {
        setCurrentStepIndex((prevIndex) => Math.max(0, prevIndex - 1))
    }, [])

    const goToNextStep = useCallback(() => {
        setCurrentStepIndex((prevIndex) =>
            Math.min(recipe.steps.length - 1, prevIndex + 1),
        )
    }, [recipe.steps.length])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft') {
                goToPreviousStep()
            } else if (event.key === 'ArrowRight') {
                goToNextStep()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [goToPreviousStep, goToNextStep])

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-3xl mx-auto h-full flex flex-col">
                <div className="flex flex-row justify-between items-center mb-6">
                    <Button variant="outline" onClick={onExit}>
                        <ArrowLeft className="h-16 w-16" />
                        Back to Recipe
                    </Button>
                </div>
                <div className="flex flex-col h-full">
                    <Progress
                        value={
                            ((currentStepIndex + 1) / recipe.steps.length) * 100
                        }
                        className="mb-4"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-grow">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Current Step
                            </h2>
                            <p className="text-lg mb-4">
                                {highlightStep(
                                    currentStep.description,
                                    recipe.ingredients.map(
                                        (ingredient) => ingredient.name,
                                    ),
                                )}
                            </p>
                        </div>
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">
                                Ingredients
                            </h2>
                            <ul className="list-disc pl-5 space-y-2">
                                {highlightIngredients(
                                    recipe.ingredients.map(
                                        (ingredient) => ingredient.name,
                                    ),
                                    currentStep.description,
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="flex justify-between mt-6">
                        <Button
                            onClick={goToPreviousStep}
                            disabled={currentStepIndex === 0}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        <Button
                            onClick={goToNextStep}
                            disabled={
                                currentStepIndex === recipe.steps.length - 1
                            }
                        >
                            Next <ChevronRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
