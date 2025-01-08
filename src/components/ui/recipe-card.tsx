'use client'
import { Trash2Icon } from "lucide-react"
import Link from "next/link"
import { Button } from "./button"
import { RecipeType } from "@/schemas/recipeSchema"
import { deleteRecipeAction } from "@/actions/deleteRecipeAction"
import { Card, CardDescription, CardHeader, CardTitle } from "./card"

export default function RecipeCard({ recipe }: { recipe: RecipeType }) {
    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation() // Prevent the link navigation when clicking delete
        try {
            await deleteRecipeAction(recipe.id)
        } catch (error) {
            console.error('Error deleting recipe:', error)
        }
    }

    return (
        <Link href={`/recipes/${recipe.id}`}>
            <Card className="relative hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                <CardHeader>
                    <CardTitle>{recipe.name}</CardTitle>
                    <CardDescription>{recipe.duration}</CardDescription>
                </CardHeader>
                
                <Button 
                    variant="destructive" 
                    size="sm" 
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    onClick={handleDelete}
                >
                    <Trash2Icon className="w-4 h-4" />
                </Button>
            </Card>
        </Link>
    )
}


