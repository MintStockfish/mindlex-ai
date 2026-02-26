import { Dispatch, SetStateAction } from "react";
import { BookOpen, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ZeroModule({
    setIsDialogOpen,
}: {
    setIsDialogOpen: Dispatch<SetStateAction<boolean>>;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-linear-to-r from-[#06b6d4]/20 to-[#3b82f6]/20 flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-[#06b6d4]" />
            </div>
            <h3 className="mb-2">Нет модулей</h3>
            <p className="text-muted-foreground max-w-md mb-6">
                Создайте свой первый модуль, чтобы начать добавлять и изучать
                карточки
            </p>
            <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
            >
                <Plus className="h-4 w-4 mr-2" />
                Создать модуль
            </Button>
        </div>
    );
}
