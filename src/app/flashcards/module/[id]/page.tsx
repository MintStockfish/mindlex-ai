"use client";

import { use } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Plus,
    Trash2,
    Volume2,
    GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";

export type Props = {
    params: Promise<{
        id: string;
    }>;
};

export interface FlashCard {
    id: string;
    word: string;
    translation: string;
    transcription?: string;
}

export default function ModuleDetail({ params }: Props) {
    const navigate = useRouter();
    const { id } = use(params);
    console.log(id);

    const [moduleTitle] = useState("Английский: IT-термины");
    const [cards, setCards] = useState<FlashCard[]>([
        {
            id: "1",
            word: "algorithm",
            translation: "алгоритм",
            transcription: "/ˈælɡərɪðəm/",
        },
        {
            id: "2",
            word: "debugging",
            translation: "отладка",
            transcription: "/dɪˈbʌɡɪŋ/",
        },
        {
            id: "3",
            word: "deployment",
            translation: "развёртывание",
            transcription: "/dɪˈplɔɪmənt/",
        },
    ]);

    const [newCard, setNewCard] = useState({
        word: "",
        translation: "",
        transcription: "",
    });

    const handleAddCard = () => {
        if (!newCard.word.trim() || !newCard.translation.trim()) {
            toast.error("Заполните слово и перевод");
            return;
        }

        const card: FlashCard = {
            id: Date.now().toString(),
            word: newCard.word,
            translation: newCard.translation,
            transcription: newCard.transcription,
        };

        setCards([...cards, card]);
        setNewCard({ word: "", translation: "", transcription: "" });
        toast.success("Карточка добавлена!");
    };

    const handleDeleteCard = (id: string) => {
        setCards(cards.filter((card) => card.id !== id));
        toast.success("Карточка удалена");
    };

    const playPronunciation = (word: string) => {
        console.log("Playing pronunciation for:", word);
        toast.info("Воспроизведение произношения...");
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
            {/* Breadcrumbs */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink className="cursor-pointer hover:text-[#06b6d4] transition-colors">
                            Мои модули
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{moduleTitle}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            {/* Header */}
            <div className="mb-8">
                <Button
                    variant="ghost"
                    onClick={() => navigate.push("/flashcards")}
                    className="mb-4 -ml-2"
                >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Назад к модулям
                </Button>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                    <div>
                        <h1 className="text-3xl sm:text-4xl mb-2">
                            {moduleTitle}
                        </h1>
                        <p className="text-muted-foreground">
                            {cards.length}{" "}
                            {cards.length === 1 ? "карточка" : "карточек"}
                        </p>
                    </div>
                    {cards.length > 0 && (
                        <Button
                            onClick={() => navigate.push(`${id}/learnModule`)}
                            className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                        >
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Начать изучение
                        </Button>
                    )}
                </div>
            </div>

            {/* Add Card Form */}
            <Card className="mb-8 border-2 border-dashed hover:border-[#06b6d4]/50 transition-colors">
                <CardContent className="pt-6">
                    <h3 className="mb-4">Добавить новую карточку</h3>
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                            <Label htmlFor="word">Слово</Label>
                            <Input
                                id="word"
                                placeholder="Введите слово..."
                                value={newCard.word}
                                onChange={(e) =>
                                    setNewCard({
                                        ...newCard,
                                        word: e.target.value,
                                    })
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="translation">Перевод</Label>
                            <Input
                                id="translation"
                                placeholder="Перевод слова..."
                                value={newCard.translation}
                                onChange={(e) =>
                                    setNewCard({
                                        ...newCard,
                                        translation: e.target.value,
                                    })
                                }
                            />
                        </div>
                    </div>
                    <div className="space-y-2 mb-4">
                        <Label htmlFor="transcription">
                            Транскрипция (опционально)
                        </Label>
                        <Input
                            id="transcription"
                            placeholder="/trænsˈkrɪpʃən/"
                            value={newCard.transcription}
                            onChange={(e) =>
                                setNewCard({
                                    ...newCard,
                                    transcription: e.target.value,
                                })
                            }
                        />
                    </div>
                    <Button
                        onClick={handleAddCard}
                        className="w-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Добавить карточку
                    </Button>
                </CardContent>
            </Card>

            {/* Cards List */}
            <div className="space-y-4">
                <h3 className="mb-4">Карточки в модуле</h3>
                {cards.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Пока нет карточек. Добавьте первую карточку выше.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {cards.map((card) => (
                            <Card
                                key={card.id}
                                className="group hover:shadow-md transition-shadow"
                            >
                                <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h4 className="text-lg">
                                                    {card.word}
                                                </h4>
                                                {card.transcription && (
                                                    <>
                                                        <code className="px-2 py-0.5 bg-muted rounded text-sm text-muted-foreground">
                                                            {card.transcription}
                                                        </code>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                playPronunciation(
                                                                    card.word
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <Volume2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-muted-foreground">
                                                {card.translation}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() =>
                                                handleDeleteCard(card.id)
                                            }
                                            className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
