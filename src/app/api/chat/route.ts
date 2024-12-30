import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

const model = process.env.OPENAI_PROMPT_RECIPE_MODEL!

export async function POST(req: Request) {
    const { messages, recipe } = await req.json()

    console.log(JSON.stringify(recipe))

    const result = streamText({
        model: openai(model),
        system: `
            You are a professional chef with 25+ years of experience.
            You know all about how ingredients affect food.

            Here is the recipe's information:
            ${JSON.stringify(recipe)}
        `,
        messages,
    })

    return result.toDataStreamResponse()
}
