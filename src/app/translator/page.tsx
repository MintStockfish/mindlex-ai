"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { AILoader } from "@/components/AILoader";
import { WordAnalysis } from "@/components/WordAnalysis";
import { SentenceAnalysis } from "@/components/SentenceAnalysis";
import { toast } from "sonner";
import { cn } from "@/components/ui/utils";
import type {
    WordData,
    ApiResponse,
    OutputBlock,
} from "@/types/translatorTypes";

export default function Translator() {
    const [query, setQuery] = useState("");
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisType, setAnalysisType] = useState<
        "word" | "sentence" | null
    >(null);

    const handleWordAnalysis = async () => {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ prompt: query }),
            });

            if (!response.ok) {
                throw new Error("Ошибка сети или сервера");
            }

            const result: ApiResponse = await response.json();

            if (result.success && result.message) {
                try {
                    const aiOutput = result.message.response?.output;

                    const messageBlock = aiOutput?.find(
                        (block: OutputBlock) => block.type === "message"
                    );

                    const aiResponseString = messageBlock?.content?.[0]?.text;

                    if (aiResponseString) {
                        const parsedData: WordData =
                            JSON.parse(aiResponseString);
                        setWordData(parsedData);
                    } else {
                        throw new Error(
                            "Не удалось найти текстовый ответ внутри объекта от ИИ."
                        );
                    }
                } catch (error) {
                    console.error(
                        "Ошибка обработки или парсинга ответа от ИИ:",
                        error
                    );
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Произошла неизвестная ошибка при разборе ответа."
                    );
                    setAnalysisType(null);
                }
            } else {
                throw new Error(
                    result.error || "Не удалось получить анализ слова."
                );
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Произошла неизвестная ошибка"
            );
            setAnalysisType(null);
        }
    };

    const handleSentenceAnalysis = async () => {};

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setWordData(null);
        setAnalysisType(null);

        try {
            const isSingleWord = query.trim().split(/\s+/).length === 1;
            const currentAnalysisType = isSingleWord ? "word" : "sentence";
            setAnalysisType(currentAnalysisType);

            if (currentAnalysisType === "word") {
                await handleWordAnalysis();
            } else {
                await handleSentenceAnalysis();
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred in handleSearch:",
                error
            );
            toast.error("Произошла совсем уж непредвиденная ошибка!");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCards = () => {
        toast.success("Слово добавлено в карточки!", {
            description: "Вы можете найти его в разделе 'Карточки'",
        });
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
            {/* Hero Section */}
            <div className="text-center mb-8 sm:mb-12">
                <h1 className="text-4xl sm:text-5xl mb-4 bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
                    Переводчик с ИИ
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Детальный разбор слов и предложений с помощью искусственного
                    интеллекта
                </p>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Введите слово или предложение для разбора..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className={cn(
                            "pl-12 pr-4 py-6 text-lg bg-card border-2 transition-colors",
                            "border-slate-300",
                            "dark:border-slate-700",
                            "hover:border-[#06b6d4]/50",
                            "dark:hover:border-[#06b6d4]/50",
                            "focus-visible:border-[#06b6d4]"
                        )}
                    />
                </div>
            </form>

            {/* Results Area */}
            <div className="min-h-[400px]">
                {isLoading && <AILoader />}

                {!isLoading && analysisType === "word" && wordData && (
                    <WordAnalysis
                        wordData={wordData}
                        onAddToCards={handleAddToCards}
                    />
                )}

                {!isLoading && analysisType === "sentence" && (
                    <SentenceAnalysis sentence={query} />
                )}

                {!isLoading && !analysisType && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-24 h-24 mb-6 rounded-full bg-linear-to-r from-[#06b6d4]/20 to-[#3b82f6]/20 flex items-center justify-center">
                            <Search className="h-12 w-12 text-[#06b6d4]" />
                        </div>
                        <h3 className="mb-2">Начните изучение</h3>
                        <p className="text-muted-foreground max-w-md">
                            Введите любое слово или предложение, и ИИ
                            предоставит детальный разбор с переводом,
                            произношением и примерами использования
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
