"use client"

import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"

export default function AddRecipeButton({ ...rest }) {
    return (
        <Button className="mb-4" {...rest}>
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Recipe
        </Button>
    )
}
