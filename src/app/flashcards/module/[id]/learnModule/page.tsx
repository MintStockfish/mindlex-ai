"use client";
import { useState, useEffect, use, useCallback } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Shuffle,
    RotateCcw,
    Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Props, FlashCard } from "../page";

export default function LearnModule({ params }: Props) {
    const navigate = useRouter();
    const { id } = use(params);

    const [moduleTitle] = useState("Английский: IT-термины");

    useEffect(() => {
        const storedItem = localStorage.getItem("modules");
        const userModules = storedItem
            ? JSON.parse(storedItem)[+id - 1].words
            : [];
        setCards(userModules);
    }, [id]);

    const [cards, setCards] = useState<FlashCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);

    const currentCard = cards[currentIndex];
    const progress = ((currentIndex + 1) / cards.length) * 100;

    const handleFlip = useCallback(() => {
        setIsFlipped((s) => !s);
    }, []);

    const goToIndex = useCallback(
        (newIndex: number) => {
            if (isFlipped) {
                setDisableTransition(true);
                setIsFlipped(false);
                window.setTimeout(() => {
                    setCurrentIndex(newIndex);
                    window.requestAnimationFrame(() =>
                        setDisableTransition(false)
                    );
                }, 20);
            } else {
                setCurrentIndex(newIndex);
            }
        },
        [isFlipped]
    );

    const handleNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            goToIndex(currentIndex + 1);
        }
    }, [currentIndex, cards.length, goToIndex]);

    const handlePrevious = useCallback(() => {
        if (currentIndex > 0) {
            goToIndex(currentIndex - 1);
        }
    }, [currentIndex, goToIndex]);

    const handleShuffle = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
        toast.success("Карточки перемешаны");
    };

    const handleReset = () => {
        setCards(cards);
        setCurrentIndex(0);
        setIsFlipped(false);
        toast.success("Порядок восстановлен");
    };

    const playPronunciation = (word: string) => {
        console.log("Playing pronunciation for:", word);
        toast.info("Воспроизведение произношения...");
    };

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                handlePrevious();
            } else if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                handleFlip();
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [handlePrevious, handleNext, handleFlip]);

    if (!currentCard) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        В этом модуле нет карточек для изучения
                    </p>
                    <Button
                        onClick={() => navigate.push("/module")}
                        className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90"
                    >
                        Вернуться к модулю
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => navigate.push("/flashcards")}
                            className="cursor-pointer hover:text-[#06b6d4] transition-colors"
                        >
                            Мои модули
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink
                            onClick={() => navigate.push(`/module/${id}`)}
                            className="cursor-pointer hover:text-[#06b6d4] transition-colors"
                        >
                            {moduleTitle}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Изучение</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate.push(`/module/${id}`)}
                    className="mb-4 -ml-2"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Назад к модулю
                </Button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl sm:text-4xl mb-2">
                            Изучение карточек
                        </h1>
                        <p className="text-muted-foreground">
                            Карточка {currentIndex + 1} из {cards.length}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleShuffle}
                            title="Перемешать карточки"
                        >
                            <Shuffle className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={handleReset}
                            title="Восстановить порядок"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Progress value={progress} className="h-2" />
            </div>

            {/* Flash Card */}
            <div className="flex flex-col items-center justify-center min-h-[400px] mb-8">
                {/* Parent with perspective */}
                <div
                    className="w-full max-w-2xl"
                    style={{ perspective: "1000px" }}
                >
                    <div
                        onClick={handleFlip}
                        key={currentCard.id}
                        className={`relative w-full h-[300px] sm:h-[350px] cursor-pointer preserve-3d`}
                        style={{
                            transformStyle: "preserve-3d",
                            transform: isFlipped
                                ? "rotateY(180deg)"
                                : "rotateY(0deg)",
                            transition: disableTransition
                                ? "none"
                                : "transform 500ms",
                            willChange: "transform",
                        }}
                    >
                        {/* Front Side - Word */}
                        <div
                            className="absolute inset-0 w-full h-full bg-linear-to-br from-[#06b6d4]/10 to-[#3b82f6]/10 border-2 border-[#06b6d4]/30 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8"
                            style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(0deg)",
                            }}
                        >
                            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                                Слово
                            </p>
                            <h2 className="text-4xl sm:text-5xl text-center mb-6">
                                {currentCard.name}
                            </h2>
                            {currentCard.ipa && (
                                <div className="flex items-center gap-3">
                                    <code className="px-3 py-1.5 bg-muted rounded text-muted-foreground">
                                        {currentCard.ipa}
                                    </code>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playPronunciation(currentCard.name);
                                        }}
                                        className="h-9 w-9 p-0"
                                    >
                                        <Volume2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-8 opacity-60">
                                Нажмите, чтобы увидеть перевод
                            </p>
                        </div>

                        {/* Back Side - Translation */}
                        <div
                            className="absolute inset-0 w-full h-full bg-linear-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 border-2 border-[#3b82f6]/30 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8"
                            style={{
                                backfaceVisibility: "hidden",
                                WebkitBackfaceVisibility: "hidden",
                                transform: "rotateY(180deg)",
                            }}
                        >
                            <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                                Перевод
                            </p>
                            <h2 className="text-4xl sm:text-5xl text-center mb-4">
                                {currentCard.translation}
                            </h2>
                            <p className="text-muted-foreground text-center">
                                {currentCard.name}
                            </p>
                            <p className="text-xs text-muted-foreground mt-8 opacity-60">
                                Нажмите, чтобы увидеть слово
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation Hint */}
                <div className="hidden sm:block mt-8 text-center text-sm text-muted-foreground">
                    <p className="mb-2">Используйте клавиши для навигации:</p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                            ←
                        </kbd>
                        <span>Предыдущая</span>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                            →
                        </kbd>
                        <span>Следующая</span>
                        <kbd className="px-2 py-1 bg-muted rounded text-xs">
                            Space
                        </kbd>
                        <span>Перевернуть</span>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto">
                <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0}
                    className="flex-1"
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Предыдущая
                </Button>
                <div className="text-sm text-muted-foreground whitespace-nowrap">
                    {currentIndex + 1} / {cards.length}
                </div>
                <Button
                    variant="outline"
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="flex-1"
                >
                    Следующая
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>

            {/* Completion Message */}
            {currentIndex === cards.length - 1 && isFlipped && (
                <div className="mt-8 text-center p-6 bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-xl border border-[#06b6d4]/30">
                    <h3 className="mb-2">🎉 Отличная работа!</h3>
                    <p className="text-muted-foreground mb-4">
                        Вы просмотрели все карточки в этом модуле
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <Button onClick={handleReset} variant="outline">
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Начать сначала
                        </Button>
                        <Button
                            onClick={() => navigate.push(`/module/${id}`)}
                            className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90"
                        >
                            Вернуться к модулю
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
