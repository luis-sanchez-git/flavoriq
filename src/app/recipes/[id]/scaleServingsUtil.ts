import { IngredientType } from '@/schemas/recipeSchema'
import { findBestUnit, convertUnits } from './unitConversions'

export const scaleIngredient = (
    ingredient: IngredientType,
    originalServings: number,
    newServings: number,
    preferredUnit?: string,
): IngredientType => {
    if (!ingredient.quantity || !originalServings || !newServings) {
        return ingredient
    }

    const scaleFactor = newServings / originalServings
    const scaledQuantity = ingredient.quantity * scaleFactor

    if (!ingredient.unit) {
        return {
            ...ingredient,
            quantity: Math.round(scaledQuantity * 100) / 100,
        }
    }

    if (preferredUnit) {
        const converted = convertUnits(
            scaledQuantity,
            ingredient.unit,
            preferredUnit,
        )
        if (converted !== null) {
            return {
                ...ingredient,
                quantity: Math.round(converted * 100) / 100,
                unit: preferredUnit,
            }
        }
    }

    const bestUnit = findBestUnit(scaledQuantity, ingredient.unit)
    if (bestUnit) {
        return {
            ...ingredient,
            quantity: bestUnit.value,
            unit: bestUnit.unit,
        }
    }

    return {
        ...ingredient,
        quantity: Math.round(scaledQuantity * 100) / 100,
    }
}
