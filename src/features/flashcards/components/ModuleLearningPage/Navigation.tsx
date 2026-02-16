import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Word } from "../../types/types";

interface NavigationProps {
    handlePrevious: () => void;
    handleNext: () => void;
    currentIndex: number;
    cards: Array<Word>;
}

function Navigation({
    handlePrevious,
    handleNext,
    currentIndex,
    cards,
}: NavigationProps) {
    return (
        <div className="flex items-center justify-between gap-4 max-w-2xl mx-auto ">
            <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className="flex-1"
            >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Предыдущая
            </Button>
            <div className="text-sm text-muted-foreground whitespace-nowrap">
                {currentIndex + 1} / {cards.length}
            </div>
            <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === cards.length - 1}
                className="flex-1"
            >
                Следующая
                <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
        </div>
    );
}

export default Navigation;
