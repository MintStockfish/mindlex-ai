import { useState, useEffect, useCallback } from "react";
import { useHistory } from "../contexts/ContextHistory";
import { toast } from "sonner";
import type {
    WordData,
    SentenceData,
    ApiResponse,
} from "@/features/translator/types/types";
import { HistoryItem } from "@/features/translator/types/types";

const STORAGE_KEY_SOURCE = "mindlex_sourceLang";
const STORAGE_KEY_TARGET = "mindlex_targetLang";
const STORAGE_KEY_PLACEHOLDER_SOURCE = "mindlex_placeholderSource";
const STORAGE_KEY_PLACEHOLDER_TARGET = "mindlex_placeholderTarget";

const MAX_INPUT_LENGTH = 100;

async function performTranslationRequest(
    prompt: string,
    sourceLang: string,
    targetLang: string,
    mode: "word" | "sentence",
): Promise<ApiResponse> {
    const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            prompt,
            sourceLang,
            targetLang,
            mode,
        }),
    });

    if (response.status === 422) {
        throw new Error("Разбор невозможен для данного ввода");
    }

    if (!response.ok) {
        throw new Error("Ошибка сети или сервера");
    }

    return await response.json();
}

export function useTranslation() {
    const [query, setQuery] = useState("");
    const [wordData, setWordData] = useState<WordData | null>(null);
    const [sentenceData, setSentenceData] = useState<SentenceData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sourceLang, setSourceLangInternal] = useState("");
    const [targetLang, setTargetLangInternal] = useState("");
    const [sourcePlaceholder, setSourcePlaceholder] = useState("English");
    const [targetPlaceholder, setTargetPlaceholder] = useState("Russian");
    const [analysisType, setAnalysisType] = useState<
        "word" | "sentence" | null
    >(null);

    const { addToHistory } = useHistory();

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedSource = localStorage.getItem(STORAGE_KEY_SOURCE);
            const savedTarget = localStorage.getItem(STORAGE_KEY_TARGET);
            const savedPlaceholderSource = localStorage.getItem(
                STORAGE_KEY_PLACEHOLDER_SOURCE,
            );
            const savedPlaceholderTarget = localStorage.getItem(
                STORAGE_KEY_PLACEHOLDER_TARGET,
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
        if (typeof window !== "undefined") {
            if (lang) {
                localStorage.setItem(STORAGE_KEY_SOURCE, lang);
            } else {
                localStorage.removeItem(STORAGE_KEY_SOURCE);
            }
        }
    }, []);

    const setTargetLang = useCallback((lang: string) => {
        setTargetLangInternal(lang);
        if (typeof window !== "undefined") {
            if (lang) {
                localStorage.setItem(STORAGE_KEY_TARGET, lang);
            } else {
                localStorage.removeItem(STORAGE_KEY_TARGET);
            }
        }
    }, []);

    const swapLanguages = useCallback(() => {
        let nextSourceLang = targetLang;
        let nextTargetLang = sourceLang;

        const nextSourcePlaceholder = targetPlaceholder;
        const nextTargetPlaceholder = sourcePlaceholder;

        let effectiveSource = nextSourceLang || nextSourcePlaceholder;
        let effectiveTarget = nextTargetLang || nextTargetPlaceholder;

        if (effectiveSource === effectiveTarget) {
            console.log("[SWAP FIX] Collision detected! Resolving...");

            if (!nextSourceLang) {
                nextSourceLang = nextTargetPlaceholder;
                effectiveSource = nextSourceLang;
            } else if (!nextTargetLang) {
                nextTargetLang = nextSourcePlaceholder;
                effectiveTarget = nextTargetLang;
            }
        }

        const finalSource = nextSourceLang || nextSourcePlaceholder;
        const finalTarget = nextTargetLang || nextTargetPlaceholder;

        setSourceLangInternal(finalSource);
        setTargetLangInternal(finalTarget);
        setSourcePlaceholder(nextSourcePlaceholder);
        setTargetPlaceholder(nextTargetPlaceholder);

        if (typeof window !== "undefined") {
            localStorage.setItem(STORAGE_KEY_SOURCE, finalSource);
            localStorage.setItem(STORAGE_KEY_TARGET, finalTarget);
            localStorage.setItem(
                STORAGE_KEY_PLACEHOLDER_SOURCE,
                nextSourcePlaceholder,
            );
            localStorage.setItem(
                STORAGE_KEY_PLACEHOLDER_TARGET,
                nextTargetPlaceholder,
            );
        }
    }, [sourceLang, targetLang, sourcePlaceholder, targetPlaceholder]);

    const handleWordAnalysis = async (
        effectiveQuery: string,
        effectiveSource: string,
        effectiveTarget: string,
    ) => {
        try {
            const result = await performTranslationRequest(
                effectiveQuery,
                effectiveSource,
                effectiveTarget,
                "word",
            );
            console.log("[TEST]: API Response (Word):", result);

            if (result.success && result.data && !("original" in result.data)) {
                const data = result.data as WordData;
                setWordData(data);
                addToHistory({
                    query: effectiveQuery,
                    sourceLang: effectiveSource,
                    targetLang: effectiveTarget,
                    type: "word",
                    data: data,
                });
            } else {
                throw new Error(
                    result.error || "Не удалось получить анализ слова",
                );
            }
        } catch (err) {
            console.error("Analysis error:", err);
            const message =
                err instanceof Error ? err.message : "Ошибка анализа";

            if (message !== "Разбор невозможен для данного ввода") {
                toast.error(message);
            }
            setError(message);
            setAnalysisType(null);
        }
    };

    const handleSentenceAnalysis = async (
        effectiveQuery: string,
        effectiveSource: string,
        effectiveTarget: string,
    ) => {
        try {
            const result = await performTranslationRequest(
                effectiveQuery,
                effectiveSource,
                effectiveTarget,
                "sentence",
            );
            console.log("[TEST]: API Response (Sentence):", result);

            if (result.success && result.data && "original" in result.data) {
                const data = result.data as SentenceData;
                setSentenceData(data);

                addToHistory({
                    query: effectiveQuery,
                    sourceLang: effectiveSource,
                    targetLang: effectiveTarget,
                    type: "sentence",
                    data: data,
                });
            } else {
                throw new Error(
                    result.error || "Не удалось получить перевод предложения",
                );
            }
        } catch (err) {
            console.error("Analysis error:", err);
            const message =
                err instanceof Error ? err.message : "Ошибка анализа";

            if (message !== "Разбор невозможен для данного ввода") {
                toast.error(message);
            }
            setError(message);
            setAnalysisType(null);
        }
    };

    const search = async (e?: React.FormEvent, overrideQuery?: string) => {
        if (e) e.preventDefault();
        const effectiveQuery = (overrideQuery || query).trim();

        if (!effectiveQuery) return;

        if (effectiveQuery.length > MAX_INPUT_LENGTH) {
            toast.error(`Input exceeds ${MAX_INPUT_LENGTH} characters`);
            return;
        }

        if (overrideQuery) {
            setQuery(overrideQuery);
        }

        const effectiveSource = sourceLang.trim() || sourcePlaceholder;
        let effectiveTarget = targetLang.trim() || targetPlaceholder;

        if (effectiveSource.toLowerCase() === effectiveTarget.toLowerCase()) {
            if (effectiveSource.toLowerCase() === "english") {
                setTargetLang("Russian");
                effectiveTarget = "Russian";
                toast.info(
                    "Target switched to Russian. I can't translate from English to English. Sorry.",
                );
            } else {
                setTargetLang("English");
                effectiveTarget = "English";
                toast.info(
                    "Source language and target language are the same. Target switched to English.",
                );
            }
        }

        setIsLoading(true);
        setWordData(null);
        setSentenceData(null);
        setError(null);
        setAnalysisType(null);

        try {
            const isSingleWord = effectiveQuery.split(/\s+/).length === 1;
            const type = isSingleWord ? "word" : "sentence";
            setAnalysisType(type);

            if (type === "word") {
                await handleWordAnalysis(
                    effectiveQuery.toLowerCase(),
                    effectiveSource,
                    effectiveTarget,
                );
            } else {
                await handleSentenceAnalysis(
                    effectiveQuery,
                    effectiveSource,
                    effectiveTarget,
                );
            }
        } catch (err) {
            const message = `Непредвиденная ошибка: ${err}`;
            toast.error(message);
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const restoreHistoryItem = (item: HistoryItem) => {
        setQuery(item.query);

        setSourceLangInternal(item.sourceLang);
        setTargetLangInternal(item.targetLang);

        setWordData(null);
        setSentenceData(null);
        setError(null);

        setAnalysisType(item.type);

        if (item.type === "word") {
            setWordData(item.data as WordData);
        } else {
            setSentenceData(item.data as SentenceData);
        }
    };

    return {
        query,
        setQuery,
        wordData,
        sentenceData,
        isLoading,
        error,
        analysisType,
        search,
        sourceLang,
        setSourceLang,
        targetLang,
        setTargetLang,
        sourcePlaceholder,
        targetPlaceholder,
        swapLanguages,
        restoreHistoryItem,
    };
}
