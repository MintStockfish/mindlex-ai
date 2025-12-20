"use client";

import { useState } from "react";
import { useModulesContext } from "@/features/flashcards/contexts/ModulesContext";

import ZeroModule from "@/features/flashcards/components/ModulesGrid/ZeroModule";
import ModulesList from "@/features/flashcards/components/ModulesGrid/ModulesList";
import FlashCardHeader from "@/features/flashcards/components/FlashCardHeader";
import { Loader2 } from "lucide-react";

export default function Cards() {
    const { modules, isLoading } = useModulesContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
                <div className="flex flex-col items-center justify-center min-h-[400px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="mt-4 text-sm text-muted-foreground">
                        Загрузка модулей...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
            <FlashCardHeader
                isDialogOpen={isDialogOpen}
                setIsDialogOpen={setIsDialogOpen}
            />

            {modules.length === 0 ? (
                <ZeroModule setIsDialogOpen={setIsDialogOpen} />
            ) : (
                <ModulesList modules={modules} />
            )}
        </div>
    );
}
