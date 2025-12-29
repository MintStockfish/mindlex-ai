import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CompletionMessageProps {
    handleReset: () => void;
    id: string;
}

function CompletionMessage({ handleReset, id }: CompletionMessageProps) {
    return (
        <div className="mt-8 text-center p-6 bg-linear-to-r from-[#06b6d4]/10 to-[#3b82f6]/10 rounded-xl border border-[#06b6d4]/30">
            <h3 className="mb-2">🎉 Отличная работа!</h3>
            <p className="text-muted-foreground mb-4">
                Вы просмотрели все карточки в этом модуле
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
                <Button onClick={handleReset} variant="outline" className="cursor-pointer">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Начать сначала
                </Button>
                <Link href={`/flashcards/module/${id}`}>
                    <Button className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 cursor-pointer">
                        Вернуться к модулю
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default CompletionMessage;
