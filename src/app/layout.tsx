import type { Metadata } from 'next'
import './globals.css'
import TopNav from './recipes/topnav'

export const metadata: Metadata = {
    title: 'FlavorIQ',
    description: 'Store Recipes',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body>
                <div className="flex flex-col min-h-svh justify-between">
                    <TopNav />
                    <main className="container px-4 py-8 self-start flex-1">
                        {children}
                    </main>
                    <footer className="w-full bg-muted py-6">
                        <div className="max-w-[1800px] mx-auto px-4 text-center text-muted-foreground">
                            <p>&copy; 2024 FlavorIQ. All rights reserved.</p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
