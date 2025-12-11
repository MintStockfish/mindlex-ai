import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import type { WordData, ApiResponse } from "@/types/translatorTypes";

const STORAGE_KEY_SOURCE = "mindlex_sourceLang";
const STORAGE_KEY_TARGET = "mindlex_targetLang";
const STORAGE_KEY_PLACEHOLDER_SOURCE = "mindlex_placeholderSource";
const STORAGE_KEY_PLACEHOLDER_TARGET = "mindlex_placeholderTarget";

export function useTranslation() {
    const [query, setQuery] = useState("");
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sourceLang, setSourceLangInternal] = useState("");
    const [targetLang, setTargetLangInternal] = useState("");
    const [sourcePlaceholder, setSourcePlaceholder] = useState("English");
    const [targetPlaceholder, setTargetPlaceholder] = useState("Russian");
    const [analysisType, setAnalysisType] = useState<
        "word" | "sentence" | null
    >(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedSource = localStorage.getItem(STORAGE_KEY_SOURCE);
            const savedTarget = localStorage.getItem(STORAGE_KEY_TARGET);
            const savedPlaceholderSource = localStorage.getItem(
                STORAGE_KEY_PLACEHOLDER_SOURCE
            );
            const savedPlaceholderTarget = localStorage.getItem(
                STORAGE_KEY_PLACEHOLDER_TARGET
            );

            if (savedSource) setSourceLangInternal(savedSource);
            if (savedTarget) setTargetLangInternal(savedTarget);
            if (savedPlaceholderSource)
                setSourcePlaceholder(savedPlaceholderSource);
            if (savedPlaceholderTarget)
                setTargetPlaceholder(savedPlaceholderTarget);
        }
    }, []);

    const setSourceLang = useCallback((lang: string) => {
        setSourceLangInternal(lang);
        if (typeof window !== "undefined" && lang) {
            localStorage.setItem(STORAGE_KEY_SOURCE, lang);
        }
    }, []);

    const setTargetLang = useCallback((lang: string) => {
        setTargetLangInternal(lang);
        if (typeof window !== "undefined" && lang) {
            localStorage.setItem(STORAGE_KEY_TARGET, lang);
        }
    }, []);

    const swapLanguages = useCallback(() => {
        const newSource = targetLang || targetPlaceholder;
        const newTarget = sourceLang || sourcePlaceholder;

        setSourceLangInternal(newSource);
        setTargetLangInternal(newTarget);

        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_SOURCE, newSource);
            localStorage.setItem(STORAGE_KEY_TARGET, newTarget);
        }

        setSourcePlaceholder(targetPlaceholder);
        setTargetPlaceholder(sourcePlaceholder);
        if (typeof window !== "undefined") {
            localStorage.setItem(
                STORAGE_KEY_PLACEHOLDER_SOURCE,
                targetPlaceholder
            );
            localStorage.setItem(
                STORAGE_KEY_PLACEHOLDER_TARGET,
                sourcePlaceholder
            );
        }
    }, [sourceLang, targetLang, sourcePlaceholder, targetPlaceholder]);

    const handleWordAnalysis = async (
        searchQuery: string,
        effectiveSource: string,
        effectiveTarget: string
    ) => {
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    prompt: searchQuery,
                    sourceLang: effectiveSource,
                    targetLang: effectiveTarget,
                }),
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
        const searchQuery = query.trim();
        if (!searchQuery) return;

        const effectiveSource = sourceLang.trim() || sourcePlaceholder;
        let effectiveTarget = targetLang.trim() || targetPlaceholder;

        if (effectiveSource.toLowerCase() === effectiveTarget.toLowerCase()) {
            if (effectiveSource.toLowerCase() === "english") {
                setTargetLang("Russian");
                effectiveTarget = "Russian";
                toast.info(
                    "Target switched to Russian. I can't translate from English to English. Sorry."
                );
            } else {
                setTargetLang("English");
                effectiveTarget = "English";
                toast.info(
                    "Source language and target language are the same. Target switched to English."
                );
            }
        }

        setIsLoading(true);
        setWordData(null);
        setAnalysisType(null);

        try {
            const isSingleWord = searchQuery.split(/\s+/).length === 1;
            const type = isSingleWord ? "word" : "sentence";
            setAnalysisType(type);

            if (type === "word") {
                await handleWordAnalysis(
                    searchQuery.toLowerCase(),
                    effectiveSource,
                    effectiveTarget
                );
            } else {
                await handleSentenceAnalysis(searchQuery);
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
        sourceLang,
        setSourceLang,
        targetLang,
        setTargetLang,
        sourcePlaceholder,
        targetPlaceholder,
        swapLanguages,
    };
}
