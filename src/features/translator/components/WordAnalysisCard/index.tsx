import { WordData } from "@/features/translator/types";
import { Card, CardContent } from "@/components/ui/card";
import EmptyState from "@/components/shared/EmptyState";
import WordHeader from "./WordHeader";
import WordExample from "./WordExample";
import WordPronunciation from "./WordPronunciaton";
import WordPartsOfSpeech from "./WordPartsOfSpeech";
import WordRelationsGroup from "./WordRelationsGroup";
import WordUsageStats from "./WordUsageStats";
import WordEtymology from "./WordEtymology";

interface WordAnalysisProps {
    wordData: WordData | null;
}

export function WordAnalysis({ wordData }: WordAnalysisProps) {
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
                        ipa={wordData.ipa}
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
