import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { tts } from "@/lib/ttsUtil";
import { SentenceData } from "../../types/types";

interface WordDetailModalProps {
    selectedWord: SentenceData["words"][0]["detail"] | null;
    onClose: () => void;
    onAnalyzeWord?: (word: string) => void;
}

export const WordDetailModal = ({
    selectedWord,
    onClose,
    onAnalyzeWord,
}: WordDetailModalProps) => {
    const handlePlayAudio = () => {
        if (!selectedWord) return;
        tts(selectedWord.word, selectedWord.languageCode);
    };

    const handleAnalyzeClick = () => {
        if (onAnalyzeWord && selectedWord) {
            onAnalyzeWord(selectedWord.word);
            onClose();
        }
    };

    return (
        <Dialog open={!!selectedWord} onOpenChange={onClose}>
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
                                onClick={handleAnalyzeClick}
                                variant="secondary"
                                size="sm"
                            >
                                Детальный разбор
                            </Button>
                        </div>

                        {/* Pronunciation Block */}
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
                                    onClick={handlePlayAudio}
                                >
                                    <Volume2 className="h-3 w-3" />
                                    Прослушать
                                </Button>
                            </div>
                        </div>

                        {/* Meaning Block */}
                        <div className="space-y-2">
                            <h4 className="text-sm text-muted-foreground">
                                Значение
                            </h4>
                            <p className="text-sm">{selectedWord.meaning}</p>
                        </div>

                        {/* Example Block */}
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
    );
};
