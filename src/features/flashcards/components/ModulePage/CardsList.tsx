import { useEffect } from "react";
import { Trash2, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { tts } from "@/lib/ttsUtil";

import { Module, Word } from "../../types/types";

interface CardsListProps {
    module: Module;
    deleteCard: (moduleId: string, cardId: string) => void;
}

function CardsList({ module, deleteCard }: CardsListProps) {
    const cards = module.words;

    const handleDeleteCard = (cardId: string) => {
        deleteCard(module.id, cardId);
    };

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
        <div className="space-y-4">
            <h3 className="mb-4">Карточки в модуле</h3>
            {cards?.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    <p>Пока нет карточек. Добавьте первую карточку выше.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {cards.map((card: Word) => (
                        <Card
                            key={card.id}
                            className="group hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h4 className="text-lg">
                                                {card.name}
                                            </h4>
                                            {card.ipa && (
                                                <>
                                                    <code className="px-2 py-0.5 bg-muted rounded text-sm text-muted-foreground">
                                                        {card.ipa}
                                                    </code>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            tts(
                                                                card.name,
                                                                card.languageCode ||
                                                                    "en",
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
                                            handleDeleteCard(card.id!)
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
    );
}

export default CardsList;
