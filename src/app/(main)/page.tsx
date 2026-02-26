"use client";
import Link from "next/link";
import { Sparkles } from "lucide-react";

import Loader from "@/components/shared/Loader";
import { useAuth } from "@/features/auth/contexts/context";
import { benefits, features } from "@/features/landing/constants";
import { FeatureCard } from "@/features/landing/FeatureCard";

export default function Home() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
            {/* Hero Section */}

            <div className="text-center mb-12 sm:mb-16">
                {user && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 mb-6">
                        <Sparkles className="h-4 w-4 text-[#06b6d4]" />
                        <span className="text-sm">
                            Добро пожаловать, {user.name}!
                        </span>
                    </div>
                )}

                <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-4 bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent leading-relaxed">
                    Изучайте языки с ИИ
                </h1>
                <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Детальный разбор слов и предложений, система карточек и
                    персонализированное обучение
                </p>
            </div>

            {/* Feature Cards */}

            <div className="grid md:grid-cols-2 gap-6 mb-12">
                {features.map((feature) => (
                    <Link key={feature.title} href={feature.path}>
                        <FeatureCard {...feature} />
                    </Link>
                ))}
            </div>

            {/* Features List  */}

            <div className="bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl mb-8 text-center">
                    Почему Mindlex AI?
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {benefits.map((benefit) => (
                        <div key={benefit.title} className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                                <h4>{benefit.title}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground pl-4">
                                {benefit.text}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
