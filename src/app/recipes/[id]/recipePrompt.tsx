'use client'

import { Button } from '@/components/ui/button'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet'
import { Textarea } from '@/components/ui/textarea'
import { RecipeType } from '@/schemas/recipeSchema'
import { useChat } from 'ai/react'
import { WandSparklesIcon } from 'lucide-react'

interface RecipePromptProps {
    recipe: RecipeType
    className?: string
}

export default function RecipePrompt({ recipe }: RecipePromptProps) {
    const { messages, input, handleInputChange, handleSubmit } = useChat({})

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button 
                        variant="secondary" 
                        className="w-10 h-10 rounded-full p-2 fixed bottom-6 right-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                    >
                        <WandSparklesIcon className="w-5 h-5 text-white" />
                    </Button>
                </SheetTrigger>
                <SheetContent className="bg-gray-50 flex flex-col w-1/3 ">
                    <SheetHeader>
                        <SheetTitle>AI</SheetTitle>
                        <SheetDescription>
                            You can ask AI anything about your recipe
                        </SheetDescription>
                    </SheetHeader>
                    <div className="overflow-auto h-full">
                        {messages.map((message) => (
                            <div key={message.id}>
                                <span className="font-semibold">
                                    {message.role === 'user'
                                        ? 'User: '
                                        : 'AI: '}
                                </span>
                                {message.content}
                            </div>
                        ))}{' '}
                    </div>

                    <form
                        onSubmit={(e) => {
                            handleSubmit(e, {
                                body: {
                                    recipe: recipe,
                                },
                            })
                        }}
                        className="flex flex-col gap-1"
                    >
                        <Textarea
                            name="prompt"
                            value={input}
                            onChange={handleInputChange}
                            className="shadow-md bg-white"
                        />
                        <Button type="submit">Submit</Button>
                    </form>
                </SheetContent>
            </Sheet>
        </>
    )
}
