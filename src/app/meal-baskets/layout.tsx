'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function MealBasketsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const path = usePathname()
    const paths = path.split('/')
    let href = '/recipes'
    if (paths.length > 2) {
        href = paths.slice(0, -1).join('/')
    }
    return (
        <section className="flex-1">
            <div className="container mx-auto px-4 py-8 h-full">
                <Link href={href}>
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
