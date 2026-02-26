"use client";

import { useState } from "react";

import Loader from "@/components/shared/Loader";
import ModulesList from "@/features/flashcards/components/ModulesPage/ModulesGrid/ModulesList";
import ZeroModule from "@/features/flashcards/components/ModulesPage/ModulesGrid/ZeroModule";
import ModulesHeader from "@/features/flashcards/components/ModulesPage/ModulesHeader";
import { useModulesContext } from "@/features/flashcards/contexts/ModulesContext";

export default function Cards() {
    const { modules, isLoading } = useModulesContext();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
            <ModulesHeader
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
