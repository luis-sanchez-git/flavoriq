"use client"

import Link from "next/link"
import { Recipe } from "@/types/recipe"

interface RecipeListProps {
    recipes: Recipe[]
}

export default function RecipeList({ recipes }: RecipeListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {recipes.map((recipe) => (
                <Link
                    href={`/recipes/${recipe.id}`}
                    key={recipe.id}
                    className="block"
                >
                    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <h2 className="text-xl font-semibold mb-2">
                            {recipe.title}
                        </h2>
                        <p className="text-gray-600">{recipe.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}
