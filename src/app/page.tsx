import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { BookOpen, PlusCircle, MessageCircle } from 'lucide-react'

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen">
            <section className="text-center mb-16">
                <h1 className="text-4xl font-bold mb-4">Welcome to FlavorIQ</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    Your intelligent recipe companion for storing, creating, and
                    exploring culinary delights.
                </p>
            </section>

            <main className="flex-grow py-16">
                <div className="max-w-[1800px] mx-auto px-4">
                    <section className="grid gap-8 md:grid-cols-3 mb-16">
                        <FeatureCard
                            icon={<BookOpen className="h-10 w-10" />}
                            title="Store Recipes"
                            description="Organize and access your favorite recipes in one place, anytime, anywhere."
                        />
                        <FeatureCard
                            icon={<PlusCircle className="h-10 w-10" />}
                            title="Easy Recipe Addition"
                            description="Add new recipes effortlessly using natural language - just describe it, and we'll format it."
                        />
                        <FeatureCard
                            icon={<MessageCircle className="h-10 w-10" />}
                            title="AI Recipe Chat"
                            description="Chat with our AI about any recipe. Get tips, substitutions, and answers to your culinary questions."
                        />
                    </section>

                    <section className="text-center mb-16">
                        <h2 className="text-3xl font-bold mb-4">
                            Discover the Power of FlavorIQ
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                            Elevate your cooking experience with our intelligent
                            recipe management and AI-powered assistance.
                        </p>
                        <Link href="/recipes">
                            <Button size="lg" className="text-lg px-8 py-6">
                                Get Started
                            </Button>
                        </Link>
                    </section>

                    {/* <section className="bg-muted rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-bold mb-4">
                            Ready to start your culinary journey?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6">
                            Join FlavorIQ today and transform the way you cook
                            and manage your recipes.
                        </p>
                        <Link href="/signup">
                            <Button
                                variant="secondary"
                                size="lg"
                                className="text-lg px-8 py-6"
                            >
                                Sign Up Now
                            </Button>
                        </Link>
                    </section> */}
                </div>
            </main>
        </div>
    )
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <Card>
            <CardHeader>
                <div className="mb-4 flex justify-center">{icon}</div>
                <CardTitle className="text-xl text-center">{title}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <CardDescription>{description}</CardDescription>
            </CardContent>
        </Card>
    )
}
