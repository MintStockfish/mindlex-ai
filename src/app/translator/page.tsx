"use client";

import { toast } from "sonner";
import { AILoader } from "@/components/ui/AILoader";
import { WordAnalysis } from "@/components/features/translator/WordAnalysisCard";
import { SentenceAnalysis } from "@/components/features/translator/SentenceAnaylysis";
import { useTranslation } from "@/hooks/useTranslation";
import { InputFocusProvider } from "@/contexts/InputFocusContext";

import TranslatorHero from "@/components/features/translator/Page/TranslatorHero";
import TranslatorSearch from "@/components/features/translator/Page/TranslatorSearch";
import TranslatorWelcome from "@/components/features/translator/Page/TranslatorWelcome";

export default function Translator() {
    const {
        query,
        setQuery,
        wordData,
        isLoading,
        analysisType,
        search,
        sourceLang,
        targetLang,
        setSourceLang,
        setTargetLang,
        sourcePlaceholder,
        targetPlaceholder,
        swapLanguages,
    } = useTranslation();

    const handleAddToCards = () => {
        toast.success("Слово добавлено в карточки!", {
            description: "Вы можете найти его в разделе 'Карточки'",
        });
    };

    return (
        <InputFocusProvider setQuery={setQuery}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
                <TranslatorHero />

                <TranslatorSearch
                    value={query}
                    onChange={setQuery}
                    onSubmit={search}
                    isLoading={isLoading}
                    sourceLang={sourceLang}
                    targetLang={targetLang}
                    setSourceLang={setSourceLang}
                    setTargetLang={setTargetLang}
                    sourcePlaceholder={sourcePlaceholder}
                    targetPlaceholder={targetPlaceholder}
                    swapLanguages={swapLanguages}
                />

                <div className="min-h-[400px]">
                    {isLoading ? (
                        <AILoader />
                    ) : (
                        <>
                            {analysisType === "word" && wordData && (
                                <WordAnalysis
                                    wordData={wordData}
                                    onAddToCards={handleAddToCards}
                                />
                            )}

                            {analysisType === "sentence" && (
                                <SentenceAnalysis sentence={query} />
                            )}

                            {!analysisType && <TranslatorWelcome />}
                        </>
                    )}
                </div>
            </div>
        </InputFocusProvider>
    );
}
