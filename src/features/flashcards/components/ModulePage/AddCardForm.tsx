import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type AddCardFormProps = {
    moduleId: string;
    addCard: (
        moduleId: string,
        card: {
            id: string;
            name: string;
            translation: string;
            ipa: string;
        }
    ) => void;
};

function AddCardForm({ moduleId, addCard }: AddCardFormProps) {
    const [newCard, setNewCard] = useState({
        word: "",
        translation: "",
        transcription: "",
    });

    const handleAdd = () => {
        addCard(moduleId, {
            id: Date.now().toString(),
            name: newCard.word,
            translation: newCard.translation,
            ipa: newCard.transcription,
        });
        setNewCard({
            word: "",
            translation: "",
            transcription: "",
        });
    };

    return (
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

                <Button
                    onClick={handleAdd}
                    className="w-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить карточку
                </Button>
            </CardContent>
        </Card>
    );
}

export default AddCardForm;
