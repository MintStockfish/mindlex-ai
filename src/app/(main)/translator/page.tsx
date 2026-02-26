"use client";

import { AILoader } from "@/components/ui/AILoader";
import EmptyStateAnimation from "@/components/shared/EmptyState";
import { WordAnalysis } from "@/features/translator/components/WordAnalysisCard";
import { SentenceAnalysis } from "@/features/translator/components/SentenceAnalysis";
import { useTranslation } from "@/features/translator/hooks/useTranslation";
import { InputFocusProvider } from "@/features/translator/contexts/InputContext";

import TranslatorHero from "@/features/translator/components/TranslatorPage/TranslatorHero";
import TranslatorSearch from "@/features/translator/components/TranslatorPage/TranslatorSearch";
import TranslatorWelcome from "@/features/translator/components/TranslatorPage/TranslatorWelcome";

export default function Translator() {
    const {
        query,
        setQuery,
        wordData,
        sentenceData,
        isLoading,
        error,
        analysisType,
        search,
        sourceLang,
        targetLang,
        setSourceLang,
        setTargetLang,
        sourcePlaceholder,
        targetPlaceholder,
        swapLanguages,
        restoreHistoryItem,
    } = useTranslation();

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
                    onHistorySelect={restoreHistoryItem}
                />

                <div className="min-h-[400px]">
                    {isLoading ? (
                        <AILoader />
                    ) : (
                        <>
                            {error ? (
                                <EmptyStateAnimation />
                            ) : (
                                <>
                                    {analysisType === "word" && wordData && (
                                        <WordAnalysis wordData={wordData} />
                                    )}

                                    {analysisType === "sentence" &&
                                        sentenceData && (
                                            <SentenceAnalysis
                                                data={sentenceData}
                                                onAnalyzeWord={(word) => {
                                                    setQuery(word);
                                                    search(undefined, word);
                                                }}
                                            />
                                        )}

                                    {!analysisType && <TranslatorWelcome />}
                                </>
                            )}
                        </>
                    )}
                </div>
            </div>
        </InputFocusProvider>
    );
}
