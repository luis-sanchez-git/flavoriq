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
            <body>
                <TopNav />
                {children}
            </body>
        </html>
    )
}
