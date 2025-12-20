"use client";

import { useState } from "react";
import { useModulesContext } from "@/features/flashcards/contexts/ModulesContext";

import ZeroModule from "@/features/flashcards/components/ModulesGrid/ZeroModule";
import ModulesList from "@/features/flashcards/components/ModulesGrid/ModulesList";
import FlashCardHeader from "@/features/flashcards/components/FlashCardHeader";

export default function Cards() {
    const { modules } = useModulesContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

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
