'use client'

import { RecipeType } from '@/schemas/recipeSchema'
import { useState } from 'react'
import { scaleIngredient } from './scaleServingsUtil'
import { getCompatibleUnits } from './unitConversions'

export const ScaleServings = ({ recipe }: { recipe: RecipeType }) => {
    const [servings, setServings] = useState(recipe.serving)
    const [preferredUnits, setPreferredUnits] = useState<{
        [key: string]: string
    }>({})

    const handleUnitChange = (ingredientIndex: number, newUnit: string) => {
        setPreferredUnits((prev) => ({
            ...prev,
            [ingredientIndex]: newUnit,
        }))
    }

    return (
        <>
            <div>
                <div className="mb-4">
                    <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
                    <label htmlFor="servings" className="mr-2">
                        Adjust servings:
                    </label>
                    <input
                        type="number"
                        id="servings"
                        min="1"
                        value={servings}
                        onChange={(e) => setServings(Number(e.target.value))}
                        className="border rounded px-2 py-1 w-20"
                    />
                    <ul className="list-disc pl-5 space-y-2">
                        {recipe.ingredients.map((ingredient, index) => {
                            const scaledIngredient = scaleIngredient(
                                ingredient,
                                recipe.serving,
                                servings,
                                preferredUnits[index],
                            )
                            const compatibleUnits = ingredient.unit
                                ? getCompatibleUnits(ingredient.unit)
                                : []

                            return (
                                <li
                                    key={index}
                                    className="flex items-center gap-2 flex-wrap"
                                >
                                    <span>{scaledIngredient.quantity}</span>
                                    {compatibleUnits.length > 1 ? (
                                        <select
                                            value={scaledIngredient.unit}
                                            onChange={(e) =>
                                                handleUnitChange(
                                                    index,
                                                    e.target.value,
                                                )
                                            }
                                            className="border rounded px-1 py-0.5"
                                        >
                                            {compatibleUnits.map((unit) => (
                                                <option key={unit} value={unit}>
                                                    {unit}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <span>{scaledIngredient.unit}</span>
                                    )}
                                    <span>{scaledIngredient.name}</span>
                                    {scaledIngredient.note && (
                                        <span className="text-gray-500">
                                            ({scaledIngredient.note})
                                        </span>
                                    )}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </div>
            <div></div>
        </>
    )
}
