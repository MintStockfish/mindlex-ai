import { WordData } from "@/types/translatorTypes";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import WordHeader from "@/components/features/translator/WordAnalysis/WordHeader";
import WordExample from "@/components/features/translator/WordAnalysis/WordExample";
import WordPronunciation from "@/components/features/translator/WordAnalysis/WordPronunciaton";
import WordPartsOfSpeech from "@/components/features/translator/WordAnalysis/WordPartsOfSpeech";
import WordRelationsGroup from "@/components/features/translator/WordAnalysis/WordRelationsGroup";
import WordUsageStats from "@/components/features/translator/WordAnalysis/WordUsageStats";
import WordEtymology from "@/components/features/translator/WordAnalysis/WordEtymology";

interface WordAnalysisProps {
    wordData: WordData | null;
    onAddToCards: () => void;
}

export function WordAnalysis({ wordData, onAddToCards }: WordAnalysisProps) {
    if (!wordData?.word || !wordData?.translation) {
        return <EmptyState />;
    }

    return (
        <Card className="border-none shadow-lg">
            <CardContent className="p-6 sm:p-8 space-y-8">
                <div className="space-y-6">
                    <WordHeader
                        word={wordData.word}
                        translation={wordData.translation}
                        onAdd={onAddToCards}
                    />

                    <WordExample
                        sentence={wordData.exampleSentence}
                        translation={wordData.exampleTranslation}
                    />

                    <WordPronunciation
                        ipa={wordData.ipa}
                        pronunciation={wordData.pronunciation}
                    />
                </div>

                <div className="pt-6">
                    <WordPartsOfSpeech parts={wordData.partsOfSpeech} />
                </div>

                <div className="pt-6 grid sm:grid-cols-2 gap-6">
                    <WordRelationsGroup
                        title="Синонимы"
                        items={wordData.synonyms}
                    />
                    <WordRelationsGroup
                        title="Антонимы"
                        items={wordData.antonyms}
                    />
                </div>

                <div className="pt-6">
                    <WordUsageStats usage={wordData.usage} />
                </div>

                <div className="pt-6">
                    <WordEtymology text={wordData.etymology} />
                </div>
            </CardContent>
        </Card>
    );
}
