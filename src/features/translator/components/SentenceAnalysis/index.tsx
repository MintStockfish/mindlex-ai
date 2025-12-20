import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SentenceData } from "@/features/translator/types";

interface SentenceAnalysisProps {
    data: SentenceData;
    onAnalyzeWord?: (word: string) => void;
}

function getPartOfSpeechColor(pos: string): string {
    const lowerPos = pos.toLowerCase();
    if (lowerPos.includes("noun") || lowerPos.includes("существительное"))
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300";
    if (lowerPos.includes("verb") || lowerPos.includes("глагол"))
        return "bg-red-500/10 text-red-700 dark:text-red-300";
    if (lowerPos.includes("adjective") || lowerPos.includes("прилагательное"))
        return "bg-green-500/10 text-green-700 dark:text-green-300";
    if (lowerPos.includes("adverb") || lowerPos.includes("наречие"))
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300";
    if (lowerPos.includes("preposition") || lowerPos.includes("предлог"))
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    if (lowerPos.includes("article") || lowerPos.includes("артикль"))
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300";
    
    return "bg-gray-500/10 text-gray-700 dark:text-gray-300";
}

function getBadgeColor(pos: string): string {
    const lowerPos = pos.toLowerCase();
    if (lowerPos.includes("noun") || lowerPos.includes("существительное"))
        return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20";
    if (lowerPos.includes("verb") || lowerPos.includes("глагол"))
        return "bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20";
    if (lowerPos.includes("adjective") || lowerPos.includes("прилагательное"))
        return "bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20";
    if (lowerPos.includes("adverb") || lowerPos.includes("наречие"))
        return "bg-orange-500/10 text-orange-700 dark:text-orange-300 border-orange-500/20";
    if (lowerPos.includes("preposition") || lowerPos.includes("предлог"))
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    if (lowerPos.includes("article") || lowerPos.includes("артикль"))
        return "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20";
    
    return "bg-gray-500/10 text-gray-700 dark:text-gray-300 border-gray-500/20";
}

export function SentenceAnalysis({ data, onAnalyzeWord }: SentenceAnalysisProps) {
    const [selectedWord, setSelectedWord] = useState<SentenceData["words"][0]["detail"] | null>(null);

    const uniquePartsOfSpeech = useMemo(() => {
        const parts = new Set(data.words.map(w => w.partOfSpeech));
        return Array.from(parts);
    }, [data.words]);

    return (
        <>
            <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-8 space-y-6">
                    {/* Original Sentence */}
                    <div className="space-y-3">
                        <h3>Исходное предложение</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-lg leading-relaxed flex flex-wrap gap-2">
                                {data.words.map((wordData, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedWord(wordData.detail)
                                        }
                                        className={`${getPartOfSpeechColor(
                                            wordData.partOfSpeech
                                        )} px-2 py-1 rounded transition-all hover:scale-105 hover:shadow-md cursor-pointer`}
                                        title={wordData.partOfSpeech}
                                    >
                                        {wordData.word}
                                    </button>
                                ))}
                            </p>
                        </div>
                    </div>

                    {/* Translation */}
                    <div className="space-y-3">
                        <h3>Перевод</h3>
                        <div className="bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-lg p-4">
                            <p className="text-lg">
                                {data.translation}
                            </p>
                        </div>
                    </div>

                    {/* Grammar Structure Legend */}
                    {uniquePartsOfSpeech.length > 0 && (
                        <div className="space-y-3">
                            <h3>Части речи</h3>
                            <div className="flex flex-wrap gap-2">
                                {uniquePartsOfSpeech.map((pos) => (
                                    <Badge
                                        key={pos}
                                        variant="outline"
                                        className={getBadgeColor(pos)}
                                    >
                                        {pos}
                                    </Badge>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Нажмите на любое слово в предложении для детального
                                разбора
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Word Detail Dialog */}
            <Dialog
                open={selectedWord !== null}
                onOpenChange={() => setSelectedWord(null)}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
                            {selectedWord?.word}
                        </DialogTitle>
                        <DialogDescription>
                            Детальный разбор слова
                        </DialogDescription>
                    </DialogHeader>
                    {selectedWord && (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-lg">
                                        {selectedWord.translation}
                                    </p>
                                    <Badge variant="secondary" className="mt-2">
                                        {selectedWord.partOfSpeech}
                                    </Badge>
                                </div>
                                <Button 
                                    onClick={() => {
                                        if (onAnalyzeWord && selectedWord) {
                                            onAnalyzeWord(selectedWord.word);
                                            setSelectedWord(null);
                                        }
                                    }}
                                    variant="secondary"
                                    size="sm"
                                >
                                    Детальный разбор
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm text-muted-foreground">
                                    Произношение
                                </h4>
                                <div className="flex items-center gap-3">
                                    <code className="px-2 py-1 bg-muted rounded text-sm">
                                        {selectedWord.ipa}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="gap-2"
                                    >
                                        <Volume2 className="h-3 w-3" />
                                        Прослушать
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm text-muted-foreground">
                                    Значение
                                </h4>
                                <p className="text-sm">
                                    {selectedWord.meaning}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <h4 className="text-sm text-muted-foreground">
                                    Пример использования
                                </h4>
                                <div className="bg-muted/50 rounded-lg p-3">
                                    <p className="text-sm italic">
                                        &ldquo;{selectedWord.example}&rdquo;
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
