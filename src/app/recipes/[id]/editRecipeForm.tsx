'use client'

import { useState } from 'react'
import { RecipeType } from '@/schemas/recipeSchema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { X, Plus, Trash2, ArrowLeft } from 'lucide-react'
import { updateRecipe } from '@/actions/updateRecipeAction'

interface EditRecipeFormProps {
    recipe: RecipeType
    onCancel: () => void
}

export function EditRecipeForm({ recipe, onCancel }: EditRecipeFormProps) {
    const [ingredients, setIngredients] = useState(recipe.ingredients)
    const [steps, setSteps] = useState(recipe.steps)
    const [name, setName] = useState(recipe.name)
    const [serving, setServing] = useState(recipe.serving)
    const [duration, setDuration] = useState(recipe.duration)

    const addIngredient = () => {
        setIngredients([
            ...ingredients,
            {
                id: '',
                name: '',
                quantity: 0,
                unit: '',
                note: '',
                category: 'Other',
            },
        ])
    }

    const addStep = () => {
        setSteps([
            ...steps,
            { id: '', stepNumber: steps.length + 1, description: '' },
        ])
    }

    const removeIngredient = (index: number) => {
        setIngredients(ingredients.filter((_, i) => i !== index))
    }

    const removeStep = (index: number) => {
        const newSteps = steps.filter((_, i) => i !== index)
        // Reorder step numbers
        newSteps.forEach((step, i) => {
            step.stepNumber = i + 1
        })
        setSteps(newSteps)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const updatedRecipe = {
            ...recipe,
            name,
            serving,
            duration,
            ingredients,
            steps,
        }

        try {
            await updateRecipe(recipe.id, updatedRecipe)
            onCancel() // Close the form on success
        } catch (error) {
            console.error('Failed to update recipe:', error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Edit Recipe</h2>
                <Button variant="outline" size="sm" onClick={onCancel}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Recipe
                </Button>
            </div>
            <div className="space-y-6">
                <div className="grid w-full gap-1.5">
                    <Label htmlFor="name" className="text-lg font-semibold">
                        Recipe Name
                    </Label>
                    <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="grid w-full gap-1.5">
                        <Label
                            htmlFor="serving"
                            className="text-lg font-semibold"
                        >
                            Servings
                        </Label>
                        <Input
                            id="serving"
                            type="number"
                            value={serving}
                            onChange={(e) => setServing(Number(e.target.value))}
                            required
                            className="w-full"
                        />
                    </div>
                    <div className="grid w-full gap-1.5">
                        <Label htmlFor="duration">Duration</Label>
                        <Input
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            className="w-full"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-lg font-semibold">
                            Ingredients
                        </Label>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-36"
                            onClick={addIngredient}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Ingredient
                        </Button>
                    </div>
                    {ingredients.map((ingredient, index) => (
                        <div key={index} className="flex gap-4 items-start">
                            <Input
                                value={ingredient.quantity}
                                onChange={(e) => {
                                    const newIngredients = [...ingredients]
                                    newIngredients[index] = {
                                        ...ingredient,
                                        quantity: Number(e.target.value),
                                    }
                                    setIngredients(newIngredients)
                                }}
                                type="number"
                                placeholder="Quantity"
                                className="w-28"
                            />
                            <Input
                                value={ingredient.unit}
                                onChange={(e) => {
                                    const newIngredients = [...ingredients]
                                    newIngredients[index] = {
                                        ...ingredient,
                                        unit: e.target.value,
                                    }
                                    setIngredients(newIngredients)
                                }}
                                placeholder="Unit"
                                className="w-28"
                            />
                            <Input
                                value={ingredient.name}
                                onChange={(e) => {
                                    const newIngredients = [...ingredients]
                                    newIngredients[index] = {
                                        ...ingredient,
                                        name: e.target.value,
                                    }
                                    setIngredients(newIngredients)
                                }}
                                placeholder="Ingredient name"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="w-10"
                                onClick={() => removeIngredient(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <Label className="text-lg font-semibold">Steps</Label>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-36"
                            onClick={addStep}
                        >
                            <Plus className="h-4 w-4 mr-2" /> Add Step
                        </Button>
                    </div>
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                                {step.stepNumber}
                            </div>
                            <Textarea
                                value={step.description}
                                onChange={(e) => {
                                    const newSteps = [...steps]
                                    newSteps[index] = {
                                        ...step,
                                        description: e.target.value,
                                    }
                                    setSteps(newSteps)
                                }}
                                placeholder="Step description"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => removeStep(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <Button type="submit">Save Changes</Button>
            </div>
        </form>
    )
}
