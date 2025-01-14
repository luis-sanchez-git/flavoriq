import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function RecipeLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex-1">
            <div className="container mx-auto px-4 py-8 h-full">
                <Link href="/recipes">
                    <Button variant="outline" className="mb-4">
                        ← Back to Recipes
                    </Button>
                </Link>
                {children}
            </div>
        </section>
    )
}
