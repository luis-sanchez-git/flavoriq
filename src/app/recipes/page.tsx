"use client"

import { AddRecipeDialog } from "./AddRecipe"

function RecipesPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Recipes</h1>
            <AddRecipeDialog />
        </div>
    )
}

export default RecipesPage
