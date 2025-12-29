import { Progress } from "@/components/ui/progress";
import { Shuffle } from "lucide-react";
import { ChevronLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";
import { Word } from "../../types/types";

interface LearnModuleHeaderProps {
    id: string;
    currentIndex: number;
    cards: Array<Word>;
    progress: number;
    setIsFlipped: Dispatch<SetStateAction<boolean>>;
    setCurrentIndex: Dispatch<SetStateAction<number>>;
    setCards: Dispatch<SetStateAction<Array<Word>>>;
    handleReset: () => void;
}

function LearnModuleHeader({
    id,
    currentIndex,
    cards,
    progress,
    setIsFlipped,
    setCurrentIndex,
    setCards,
    handleReset,
}: LearnModuleHeaderProps) {
    const handleShuffle = () => {
        const shuffled = [...cards].sort(() => Math.random() - 0.5);
        setCards(shuffled);
        setCurrentIndex(0);
        setIsFlipped(false);
        toast.success("Карточки перемешаны");
    };


    return (
        <div className="mb-8">
            <Link href={`/module/${id}`}>
                <Button variant="ghost" className="mb-4 -ml-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Назад к модулю
                </Button>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl mb-2">
                        Изучение карточек
                    </h1>
                    <p className="text-muted-foreground">
                        Карточка {currentIndex + 1} из {cards.length}
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleShuffle}
                        title="Перемешать карточки"
                    >
                        <Shuffle className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleReset}
                        title="Восстановить порядок"
                    >
                        <RotateCcw className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <Progress value={progress} className="h-2" />
        </div>
    );
}

export default LearnModuleHeader;
