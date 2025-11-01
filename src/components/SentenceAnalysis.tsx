import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";

interface SentenceAnalysisProps {
    sentence: string;
}

interface WordDetail {
    word: string;
    translation: string;
    partOfSpeech: string;
    ipa: string;
    meaning: string;
    example: string;
}

export function SentenceAnalysis({ sentence }: SentenceAnalysisProps) {
    const [selectedWord, setSelectedWord] = useState<WordDetail | null>(null);
    console.log(sentence);

    const sentenceData = {
        original: "The quick brown fox jumps over the lazy dog.",
        translation: "Быстрая коричневая лиса прыгает через ленивую собаку.",
        words: [
            {
                word: "The",
                partOfSpeech: "Article",
                color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
                detail: {
                    word: "the",
                    translation: "определённый артикль",
                    partOfSpeech: "Article",
                    ipa: "/ðə/, /ði/",
                    meaning:
                        "Используется для обозначения определённого предмета или понятия",
                    example: "The sun rises in the east.",
                },
            },
            {
                word: "quick",
                partOfSpeech: "Adjective",
                color: "bg-green-500/10 text-green-700 dark:text-green-300",
                detail: {
                    word: "quick",
                    translation: "быстрый",
                    partOfSpeech: "Adjective",
                    ipa: "/kwɪk/",
                    meaning:
                        "Движущийся или способный двигаться с большой скоростью",
                    example: "She gave him a quick answer.",
                },
            },
            {
                word: "brown",
                partOfSpeech: "Adjective",
                color: "bg-green-500/10 text-green-700 dark:text-green-300",
                detail: {
                    word: "brown",
                    translation: "коричневый",
                    partOfSpeech: "Adjective",
                    ipa: "/braʊn/",
                    meaning:
                        "Цвет, получаемый смешением красного, жёлтого и чёрного",
                    example: "He has brown eyes.",
                },
            },
            {
                word: "fox",
                partOfSpeech: "Noun",
                color: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
                detail: {
                    word: "fox",
                    translation: "лиса",
                    partOfSpeech: "Noun",
                    ipa: "/fɒks/",
                    meaning:
                        "Хищное млекопитающее семейства псовых с пушистым хвостом",
                    example: "A fox was seen in the garden.",
                },
            },
            {
                word: "jumps",
                partOfSpeech: "Verb",
                color: "bg-red-500/10 text-red-700 dark:text-red-300",
                detail: {
                    word: "jump",
                    translation: "прыгать",
                    partOfSpeech: "Verb",
                    ipa: "/dʒʌmp/",
                    meaning:
                        "Отталкиваться от поверхности, чтобы подняться в воздух",
                    example: "The cat jumped onto the table.",
                },
            },
            {
                word: "over",
                partOfSpeech: "Preposition",
                color: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
                detail: {
                    word: "over",
                    translation: "над, через",
                    partOfSpeech: "Preposition",
                    ipa: "/ˈəʊvə(r)/",
                    meaning: "Выражает движение или положение выше чего-либо",
                    example: "The bird flew over the house.",
                },
            },
            {
                word: "the",
                partOfSpeech: "Article",
                color: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
                detail: {
                    word: "the",
                    translation: "определённый артикль",
                    partOfSpeech: "Article",
                    ipa: "/ðə/, /ði/",
                    meaning:
                        "Используется для обозначения определённого предмета или понятия",
                    example: "The sun rises in the east.",
                },
            },
            {
                word: "lazy",
                partOfSpeech: "Adjective",
                color: "bg-green-500/10 text-green-700 dark:text-green-300",
                detail: {
                    word: "lazy",
                    translation: "ленивый",
                    partOfSpeech: "Adjective",
                    ipa: "/ˈleɪzi/",
                    meaning: "Не желающий работать или прилагать усилия",
                    example: "He's too lazy to do any work.",
                },
            },
            {
                word: "dog.",
                partOfSpeech: "Noun",
                color: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
                detail: {
                    word: "dog",
                    translation: "собака",
                    partOfSpeech: "Noun",
                    ipa: "/dɒɡ/",
                    meaning:
                        "Домашнее животное, часто содержащееся как питомец или для работы",
                    example: "They have a pet dog.",
                },
            },
        ],
    };

    return (
        <>
            <Card className="border-none shadow-lg">
                <CardContent className="p-6 sm:p-8 space-y-6">
                    {/* Original Sentence */}
                    <div className="space-y-3">
                        <h3>Исходное предложение</h3>
                        <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-lg leading-relaxed flex flex-wrap gap-2">
                                {sentenceData.words.map((wordData, index) => (
                                    <button
                                        key={index}
                                        onClick={() =>
                                            setSelectedWord(wordData.detail)
                                        }
                                        className={`${wordData.color} px-2 py-1 rounded transition-all hover:scale-105 hover:shadow-md cursor-pointer`}
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
                        <div className="bg-gradient-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-lg p-4">
                            <p className="text-lg">
                                {sentenceData.translation}
                            </p>
                        </div>
                    </div>

                    {/* Grammar Structure Legend */}
                    <div className="space-y-3">
                        <h3>Части речи</h3>
                        <div className="flex flex-wrap gap-2">
                            <Badge
                                variant="outline"
                                className="bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20"
                            >
                                Артикль
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-green-500/10 text-green-700 dark:text-green-300 border-green-500/20"
                            >
                                Прилагательное
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20"
                            >
                                Существительное
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-red-500/10 text-red-700 dark:text-red-300 border-red-500/20"
                            >
                                Глагол
                            </Badge>
                            <Badge
                                variant="outline"
                                className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20"
                            >
                                Предлог
                            </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Нажмите на любое слово в предложении для детального
                            разбора
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Word Detail Dialog */}
            <Dialog
                open={selectedWord !== null}
                onOpenChange={() => setSelectedWord(null)}
            >
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent">
                            {selectedWord?.word}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedWord && (
                        <div className="space-y-4">
                            <div>
                                <p className="text-lg">
                                    {selectedWord.translation}
                                </p>
                                <Badge variant="secondary" className="mt-2">
                                    {selectedWord.partOfSpeech}
                                </Badge>
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
