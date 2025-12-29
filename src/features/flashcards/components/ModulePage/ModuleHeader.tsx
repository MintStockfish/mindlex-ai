import { ChevronLeft, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Word } from "../../types/types";

interface ModuleHeaderProps {
    id: string;
    moduleTitle: string;
    cards: Word[];
}

function ModuleHeader({ id, moduleTitle, cards }: ModuleHeaderProps) {
    return (
        <div className="mb-8">
            <Link href="/flashcards">
                <Button variant="ghost" className="mb-4 -ml-2">
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Назад к модулям
                </Button>
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
                <div>
                    <h1 className="text-3xl sm:text-4xl mb-2">{moduleTitle}</h1>
                    <p className="text-muted-foreground">
                        {cards?.length ?? 0}{" "}
                        {cards?.length === 1 ? "карточка" : "карточек"}
                    </p>
                </div>
                {cards?.length > 0 && (
                    <Link href={`${id}/learn`}>
                        <Button className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity">
                            <GraduationCap className="h-4 w-4 mr-2" />
                            Начать изучение
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}

export default ModuleHeader;
