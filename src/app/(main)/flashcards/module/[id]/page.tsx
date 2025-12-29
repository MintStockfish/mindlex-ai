"use client";

import { use, useMemo } from "react";
import { useModulesContext } from "@/features/flashcards/contexts/ModulesContext";
import Breadcrumbs from "@/features/flashcards/components/ModulePage/Breadcrumbs";
import ModuleHeader from "@/features/flashcards/components/ModulePage/ModuleHeader";
import AddCardForm from "@/features/flashcards/components/ModulePage/AddCardForm";
import CardsList from "@/features/flashcards/components/ModulePage/CardsList";
import Loader from "@/components/shared/Loader";

export type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default function ModuleDetail({ params }: Props) {
    const { id } = use(params);
    const { modules, addCard, deleteCard, isLoading } = useModulesContext();

    const currentModule = useMemo(
        () => modules.find((m) => m.id === id),
        [modules, id]
    );

    if (isLoading) {
        return <Loader />;
    }

    if (!currentModule) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
                <h2 className="text-xl font-medium text-gray-700 dark:text-gray-300">
                    Module not found
                </h2>
                <p className="text-gray-500 dark:text-gray-400 max-w-md text-center">
                    The module you&apos;re looking for doesn&apos;t exist or has
                    been deleted.
                </p>
            </div>
        );
    }

    const moduleTitle = currentModule.title;
    const cards = currentModule.words;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl py-8 sm:py-12">
            <Breadcrumbs moduleTitle={moduleTitle} />

            <ModuleHeader id={id} moduleTitle={moduleTitle} cards={cards} />

            <AddCardForm moduleId={id} addCard={addCard} />

            <CardsList module={currentModule} deleteCard={deleteCard} />
        </div>
    );
}
