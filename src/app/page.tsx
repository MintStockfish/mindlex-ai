"use client";
import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { BookOpen, Languages, Sparkles, ArrowRight } from "lucide-react";
import { useAuth } from "@/features/auth/context";

export default function Home() {
    const navigate = useRouter();
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
            {/* Hero Section */}
            <div className="text-center mb-12 sm:mb-16">
                {user && (
                    <>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 mb-6">
                            <Sparkles className="h-4 w-4 text-[#06b6d4]" />
                            <span className="text-sm">
                                Добро пожаловать, {user?.name}!
                            </span>
                        </div>
                    </>
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
                {/* Translator Card */}
                <Card
                    onClick={() => navigate.push("/translator")}
                    className="group cursor-pointer hover:shadow-xl hover:border-[#06b6d4]/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-[#06b6d4]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-linear-to-r from-[#06b6d4] to-[#3b82f6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Languages className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="flex items-center justify-between">
                            Переводчик с ИИ
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#06b6d4] group-hover:translate-x-1 transition-all" />
                        </CardTitle>
                        <CardDescription>
                            Получите детальный разбор любого слова или
                            предложения с переводом, произношением, примерами и
                            этимологией
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Перевод
                            </div>
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Произношение
                            </div>
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Синонимы
                            </div>
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Примеры
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cards Card */}
                <Card
                    onClick={() => navigate.push("/flashcards")}
                    className="group cursor-pointer hover:shadow-xl hover:border-[#06b6d4]/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden relative"
                >
                    <div className="absolute inset-0 bg-linear-to-br from-[#3b82f6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader>
                        <div className="w-12 h-12 rounded-lg bg-linear-to-r from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <CardTitle className="flex items-center justify-between">
                            Система карточек
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#06b6d4] group-hover:translate-x-1 transition-all" />
                        </CardTitle>
                        <CardDescription>
                            Создавайте модули карточек и изучайте слова
                            эффективно. Добавляйте слова из переводчика одним
                            кликом
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Модули
                            </div>
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Карточки
                            </div>
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Повторение
                            </div>
                            <div className="px-3 py-1 rounded-full bg-muted text-xs">
                                Организация
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Features List */}
            <div className="bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-2xl p-8 sm:p-12">
                <h2 className="text-2xl sm:text-3xl mb-8 text-center">
                    Почему Mindlex AI?
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                            <h4>Детальный анализ</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4">
                            Получайте полный разбор каждого слова с примерами и
                            контекстом
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                            <h4>Интеллектуальные карточки</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4">
                            Система повторения для эффективного запоминания
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                            <h4>Произношение</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4">
                            IPA транскрипция и аудио для правильного
                            произношения
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                            <h4>Этимология</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4">
                            Узнайте историю происхождения каждого слова
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                            <h4>Контекст использования</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4">
                            Понимайте, где и как использовать слова правильно
                        </p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6]" />
                            <h4>Персонализация</h4>
                        </div>
                        <p className="text-sm text-muted-foreground pl-4">
                            Создавайте собственные модули под ваши цели
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
