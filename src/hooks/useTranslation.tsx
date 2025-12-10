import { useState } from "react";
import { toast } from "sonner";
import type { WordData, ApiResponse } from "@/types/translatorTypes";

export function useTranslation() {
    const [query, setQuery] = useState("");
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisType, setAnalysisType] = useState<
        "word" | "sentence" | null
    >(null);

    const handleWordAnalysis = async (searchQuery: string) => {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: searchQuery }),
            });

            if (!response.ok) throw new Error("Ошибка сети или сервера");

            const result: ApiResponse = await response.json();
            console.log("[TEST]: API Response:", result);

            if (result.success && result.data) {
                setWordData(result.data);
            } else {
                throw new Error(
                    result.error || "Не удалось получить анализ слова"
                );
            }
        } catch (error) {
            console.error("Analysis error:", error);
            toast.error(
                error instanceof Error ? error.message : "Ошибка анализа"
            );
            setAnalysisType(null);
        }
    };

    const handleSentenceAnalysis = async (searchQuery: string) => {
        // Тут будет логика для предложений
        console.log("Analyzing sentence:", searchQuery);
    };

    const search = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setWordData(null);
        setAnalysisType(null);

        try {
            const isSingleWord = query.trim().split(/\s+/).length === 1;
            const type = isSingleWord ? "word" : "sentence";
            setAnalysisType(type);

            if (type === "word") {
                await handleWordAnalysis(query.toLowerCase());
            } else {
                await handleSentenceAnalysis(query);
            }
        } catch (error) {
            toast.error(`Непредвиденная ошибка: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        query,
        setQuery,
        wordData,
        isLoading,
        analysisType,
        search,
    };
}
