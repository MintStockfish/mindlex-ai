"use client";
import { useState, useEffect, use, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Props } from "../page";
import type { Word } from "@/features/flashcards/types/types";
import { useModulesContext } from "@/features/flashcards/contexts/ModulesContext";
import Loader from "@/components/shared/Loader";
import Link from "next/link";
import Breadcrumbs from "@/features/flashcards/components/ModuleLearningPage/Breadcrumbs";
import LearnModuleHeader from "@/features/flashcards/components/ModuleLearningPage/LearnModuleHeader";
import FlashCard from "@/features/flashcards/components/ModuleLearningPage/FlashCard";
import CompletionMessage from "@/features/flashcards/components/ModuleLearningPage/CompletionMessage";
import Navigation from "@/features/flashcards/components/ModuleLearningPage/Navigation";

export default function LearnModule({ params }: Props) {
    const { id } = use(params);

    const { modules, isLoading } = useModulesContext();
    const currentModule = modules.find((m) => m.id === id);

    const [moduleTitle, setModuleTitle] = useState("");
    const [cards, setCards] = useState<Word[]>([]);
    const [originalCards, setOriginalCards] = useState<Word[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [disableTransition, setDisableTransition] = useState(false);

    useEffect(() => {
        if (currentModule) {
            setModuleTitle(currentModule.title);
            setCards(currentModule.words);
            setOriginalCards(currentModule.words);
        }
    }, [currentModule]);

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

    const handleReset = () => {
        setCards(originalCards);
        setCurrentIndex(0);
        setIsFlipped(false);
        toast.success("Порядок восстановлен");
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

    if (isLoading) {
        return <Loader />;
    }

    if (!currentCard) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
                <div className="text-center py-12">
                    <p className="text-muted-foreground mb-4">
                        В этом модуле нет карточек для изучения
                    </p>
                    <Link href={`/flashcards/module/${id}`}>
                        <Button className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90">
                            Вернуться к модулю
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
            <Breadcrumbs id={id} moduleTitle={moduleTitle} />

            <LearnModuleHeader
                cards={cards}
                currentIndex={currentIndex}
                id={id}
                progress={progress}
                setCards={setCards}
                setCurrentIndex={setCurrentIndex}
                setIsFlipped={setIsFlipped}
                handleReset={handleReset}
            />

            <FlashCard
                currentCard={currentCard}
                disableTransition={disableTransition}
                handleFlip={handleFlip}
                isFlipped={isFlipped}
            />

            <Navigation
                cards={cards}
                currentIndex={currentIndex}
                handleNext={handleNext}
                handlePrevious={handlePrevious}
            />

            {/* Completion Message */}

            {currentIndex === cards.length - 1 && isFlipped && (
                <CompletionMessage handleReset={handleReset} id={id} />
            )}
        </div>
    );
}
