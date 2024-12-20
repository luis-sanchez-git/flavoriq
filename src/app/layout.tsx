import type { Metadata } from "next"
import "./globals.css"
import TopNav from "./recipes/topnav"

export const metadata: Metadata = {
    title: "FlavorIQ",
    description: "Store Recipes",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className="w-full min-h-screen">
                <TopNav />
                <div className="container mx-auto px-4 py-8">{children}</div>
            </body>
        </html>
    )
}
