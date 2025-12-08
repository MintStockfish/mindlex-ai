import { Volume2, BookOpen, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import EmptyState from "@/components/EmptyState";

interface WordData {
    word: string;
    translation: string;
    exampleSentence: string;
    exampleTranslation: string;
    ipa: string;
    pronunciation: string;
    partsOfSpeech: {
        type: string;
        meaning: string;
        example: string;
    }[];
    synonyms: { word: string; ipa: string }[];
    antonyms: { word: string; ipa: string }[];
    usage: { informal: string; neutral: string; formal: string };
    etymology: string;
}

interface WordAnalysisProps {
    wordData: WordData | null;
    onAddToCards: () => void;
}

export function WordAnalysis({ wordData, onAddToCards }: WordAnalysisProps) {
    const playPronunciation = () => {
        console.log("Playing pronunciation...");
    };

    console.log(wordData);

    if (wordData?.word && wordData?.translation) {
        return (
            <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-8 space-y-6">
                    {/* Header with Add Button */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <h2 className="text-3xl sm:text-4xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent mb-2">
                                {wordData?.translation}
                            </h2>
                            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                <span className="italic">{wordData?.word}</span>
                            </div>
                        </div>
                        <Button
                            onClick={onAddToCards}
                            className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity shrink-0"
                        >
                            <Plus className="h-4 w-4 mr-2" />В карточки
                        </Button>
                    </div>

                    {/* Example Sentence */}
                    <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                        <p className="italic">
                            &ldquo;{wordData?.exampleSentence}&rdquo;
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {wordData?.exampleTranslation}
                        </p>
                    </div>

                    {/* Pronunciation */}
                    <div className="space-y-3">
                        <h3>Произношение</h3>
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    IPA:
                                </span>
                                <code className="px-2 py-1 bg-muted rounded text-sm">
                                    {wordData?.ipa}
                                </code>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                    Русскими:
                                </span>
                                <span className="text-sm">
                                    {wordData?.pronunciation}
                                </span>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={playPronunciation}
                                className="gap-2"
                            >
                                <Volume2 className="h-4 w-4" />
                                Прослушать
                            </Button>
                        </div>
                    </div>

                    {/* Parts of Speech */}
                    <div className="space-y-3">
                        <h3>Части речи</h3>
                        <Tabs defaultValue="0" className="w-full">
                            <TabsList className="w-full sm:w-auto">
                                {wordData?.partsOfSpeech.map((pos, index) => (
                                    <TabsTrigger
                                        key={index}
                                        value={index.toString()}
                                    >
                                        {pos.type}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                            {wordData?.partsOfSpeech.map((pos, index) => (
                                <TabsContent
                                    key={index}
                                    value={index.toString()}
                                    className="space-y-2 mt-4"
                                >
                                    <p className="text-sm">{pos.meaning}</p>
                                    <div className="bg-muted/50 rounded-lg p-3">
                                        <p className="text-sm italic">
                                            &ldquo;{pos.example}&rdquo;
                                        </p>
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </div>

                    {/* Synonyms and Antonyms */}
                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h3>Синонимы</h3>
                            <div className="flex flex-wrap gap-2">
                                {wordData?.synonyms.map((syn, index) => (
                                    <div
                                        key={index}
                                        className="group bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 transition-colors cursor-pointer"
                                    >
                                        <p className="text-sm">{syn.word}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {syn.ipa}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-3">
                            <h3>Антонимы</h3>
                            <div className="flex flex-wrap gap-2">
                                {wordData?.antonyms.map((ant, index) => (
                                    <div
                                        key={index}
                                        className="group bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 transition-colors cursor-pointer"
                                    >
                                        <p className="text-sm">{ant.word}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {ant.ipa}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Usage Style */}
                    <div className="space-y-3">
                        <h3>Стиль использования</h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Неформальный
                                    </span>
                                    <span>{wordData?.usage.informal}%</span>
                                </div>
                                {wordData?.usage?.informal && (
                                    <Progress
                                        value={+wordData?.usage?.informal}
                                        className="h-2"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Нейтральный
                                    </span>
                                    <span>{wordData?.usage.neutral}%</span>
                                </div>
                                {wordData?.usage?.neutral && (
                                    <Progress
                                        value={+wordData?.usage?.neutral}
                                        className="h-2"
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">
                                        Формальный
                                    </span>
                                    <span>{wordData?.usage.formal}%</span>
                                </div>
                                {wordData?.usage?.formal && (
                                    <Progress
                                        value={+wordData?.usage?.formal}
                                        className="h-2"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Etymology */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-[#06b6d4]" />
                            <h3>Происхождение (Этимология)</h3>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {wordData?.etymology}
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return <EmptyState />;
}
