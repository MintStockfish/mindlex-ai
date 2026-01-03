import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";
import { useCallback, useEffect } from "react";
import { tts } from "@/features/translator/utils/ttsUtil";

interface FlashCardProps {
    currentCard: {
        id: string | number;
        name: string;
        ipa?: string;
        translation: string;
        languageCode?: string;
    };
    handleFlip: () => void;
    isFlipped: boolean;
    disableTransition: boolean;
}

function FlashCard({
    currentCard,
    handleFlip,
    isFlipped,
    disableTransition,
}: FlashCardProps) {
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

    const playPronunciation = useCallback(() => {
        tts(currentCard.name, currentCard.languageCode);
    }, [currentCard]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] mb-8">
            <div className="w-full max-w-2xl" style={{ perspective: "1000px" }}>
                <div
                    onClick={handleFlip}
                    key={currentCard.id}
                    className={`relative w-full h-[300px] sm:h-[350px] cursor-pointer preserve-3d`}
                    style={{
                        transformStyle: "preserve-3d",
                        transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        transition: disableTransition
                            ? "none"
                            : "transform 500ms",
                        willChange: "transform",
                    }}
                >
                    {/* Front Side - Word */}

                    <div
                        className="absolute inset-0 w-full h-full bg-linear-to-br from-[#06b6d4]/10 to-[#3b82f6]/10 border-2 border-[#06b6d4]/30 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(0deg)",
                        }}
                    >
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                            Слово
                        </p>
                        <h2 className="text-4xl sm:text-5xl text-center mb-6">
                            {currentCard.name}
                        </h2>
                        {currentCard.ipa && (
                            <div className="flex items-center gap-3">
                                <code className="px-3 py-1.5 bg-muted rounded text-muted-foreground">
                                    {currentCard.ipa}
                                </code>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playPronunciation();
                                    }}
                                    className="h-9 w-9 p-0"
                                >
                                    <Volume2 className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-8 opacity-60">
                            Нажмите, чтобы увидеть перевод
                        </p>
                    </div>

                    {/* Back Side - Translation */}

                    <div
                        className="absolute inset-0 w-full h-full bg-linear-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10 border-2 border-[#3b82f6]/30 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8"
                        style={{
                            backfaceVisibility: "hidden",
                            WebkitBackfaceVisibility: "hidden",
                            transform: "rotateY(180deg)",
                        }}
                    >
                        <p className="text-sm uppercase tracking-wider text-muted-foreground mb-4">
                            Перевод
                        </p>
                        <h2 className="text-4xl sm:text-5xl text-center mb-4">
                            {currentCard.translation}
                        </h2>
                        <p className="text-muted-foreground text-center">
                            {currentCard.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-8 opacity-60">
                            Нажмите, чтобы увидеть слово
                        </p>
                    </div>
                </div>
            </div>
            <div className="hidden sm:block mt-8 text-center text-sm text-muted-foreground">
                <p className="mb-2">Используйте клавиши для навигации:</p>
                <div className="flex items-center justify-center gap-4 flex-wrap">
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">←</kbd>
                    <span>Предыдущая</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">→</kbd>
                    <span>Следующая</span>
                    <kbd className="px-2 py-1 bg-muted rounded text-xs">
                        Space
                    </kbd>
                    <span>Перевернуть</span>
                </div>
            </div>
        </div>
    );
}

export default FlashCard;
