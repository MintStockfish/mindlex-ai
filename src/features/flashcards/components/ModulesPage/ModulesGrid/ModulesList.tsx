import { BookOpen, ChevronRight } from "lucide-react";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";

import { Module } from "@/features/flashcards/types/types";

export default function ModulesList({ modules }: { modules: Module[] }) {
    const navigate = useRouter();

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module) => (
                <Card
                    key={module.id}
                    className="group cursor-pointer hover:shadow-lg hover:border-[#06b6d4]/50 transition-all duration-300 hover:-translate-y-1"
                    onClick={() =>
                        navigate.push(`flashcards/module/${module.id}`)
                    }
                >
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                                <CardTitle className="line-clamp-2 mb-2">
                                    {module.title}
                                </CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {module.description || "Без описания"}
                                </CardDescription>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#06b6d4] transition-colors shrink-0" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>
                                {module.wordCount}{" "}
                                {module.wordCount === 1 ? "слово" : "слов"}
                            </span>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
