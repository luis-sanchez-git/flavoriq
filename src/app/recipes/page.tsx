"use client"

import { AddRecipeDialog } from "./AddRecipe"

function RecipesPage() {
    return (
        <div>
            <h1
                data-testid="recipes-page-header"
                className="text-3xl font-bold mb-6"
            >
                Recipes
            </h1>
            <AddRecipeDialog />
        </div>
    )
}

export default RecipesPage
