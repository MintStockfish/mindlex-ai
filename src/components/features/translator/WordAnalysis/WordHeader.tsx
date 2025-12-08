import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function WordHeader({
    word,
    translation,
    onAdd,
}: {
    word: string;
    translation: string;
    onAdd: () => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
                <h2 className="text-3xl sm:text-4xl bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent mb-2">
                    {translation}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="italic">{word}</span>
                </div>
            </div>
            <Button
                onClick={onAdd}
                className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity shrink-0"
            >
                <Plus className="h-4 w-4 mr-2" />В карточки
            </Button>
        </div>
    );
}