import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

export default function MealBasketsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <section className="flex-1">
            <div className="container mx-auto px-4 py-8 h-full">
                <Link href="/recipes">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Go Back
                    </Button>
                </Link>
                {children}
            </div>
        </section>
    )
}
