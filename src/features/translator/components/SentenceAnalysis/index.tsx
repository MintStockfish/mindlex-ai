import { useEffect, useMemo, useState } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { GrammarLegend } from "./GrammarLegend";
import { SentenceDisplay } from "./SentenceDisplay";
import { TranslationDisplay } from "./TranslationDisplay";
import { WordDetailModal } from "./WordDetailModal";

import { SentenceData } from "../../types/types";

interface SentenceAnalysisProps {
    data: SentenceData;
    onAnalyzeWord?: (word: string) => void;
}

export function SentenceAnalysis({
    data,
    onAnalyzeWord,
}: SentenceAnalysisProps) {
    const [selectedWord, setSelectedWord] = useState<
        SentenceData["words"][0]["detail"] | null
    >(null);

    const uniquePartsOfSpeech = useMemo(() => {
        const parts = new Set(data.words.map((w) => w.partOfSpeech));
        return Array.from(parts);
    }, [data.words]);

    useEffect(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.getVoices();
        }
        return () => {
            if (typeof window !== "undefined") {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    return (
        <>
            <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-8 space-y-6">
                    <SentenceDisplay
                        words={data.words}
                        onWordClick={setSelectedWord}
                    />

                    <TranslationDisplay translation={data.translation} />

                    <GrammarLegend partsOfSpeech={uniquePartsOfSpeech} />
                </CardContent>
            </Card>

            <WordDetailModal
                selectedWord={selectedWord}
                onClose={() => setSelectedWord(null)}
                onAnalyzeWord={onAnalyzeWord}
            />
        </>
    );
}
