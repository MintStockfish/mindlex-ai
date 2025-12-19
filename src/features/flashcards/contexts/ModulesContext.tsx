"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import type { Module, Word } from "@/features/flashcards/types";

interface ModulesContextType {
    modules: Module[];
    moduleTitle: string | null;
    currentModuleWords: Word[];
    setModuleId: (id: string) => void;
    createModule: (data: { title: string; description?: string }) => string | null;
    addCard: (moduleId: string, cardData: Word) => void;
    deleteCard: (moduleId: string, cardId: string) => void;
}

const ModulesContext = createContext<ModulesContextType | undefined>(undefined);

export function ModulesProvider({ children, id: initialId }: { children: ReactNode; id?: string }) {
    const [modules, setModules] = useState<Module[]>([]);
    const [moduleId, setModuleId] = useState<string | undefined>(initialId);
    const [moduleTitle, setModuleTitle] = useState<string | null>(null);
    const [currentModuleWords, setCurrentModuleWords] = useState<Word[]>([]);

    useEffect(() => {
        const storedItem = localStorage.getItem("modules");
        const userModules: Module[] = storedItem ? JSON.parse(storedItem) : [];
        setModules(userModules);
    }, []);

    useEffect(() => {
        if (moduleId && modules.length > 0) {
            const currentModule = modules.find((module) => module.id === moduleId);
            if (currentModule) {
                setModuleTitle(currentModule.title);
                setCurrentModuleWords(currentModule.words);
            }
        }
    }, [moduleId, modules]);

    const createModule = (data: {
        title: string;
        description?: string;
    }): string | null => {
        if (!data.title.trim()) {
            toast.error("Введите название модуля");
            return null;
        }

        let nextId = "1";

        setModules((prevModules) => {
            if (prevModules.length > 0) {
                const lastModuleId = prevModules[prevModules.length - 1].id;
                const nextNumericId = parseInt(lastModuleId, 10) + 1;
                nextId = nextNumericId.toString();
            }

            const createdModule: Module = {
                id: nextId,
                title: data.title,
                description: data.description || "",
                words: [],
                wordCount: 0,
            };

            const updatedModules = [...prevModules, createdModule];
            localStorage.setItem("modules", JSON.stringify(updatedModules));
            return updatedModules;
        });

        toast.success("Модуль создан!", {
            description: "Теперь вы можете добавить в него карточки",
        });

        return nextId;
    };

    const addCard = (moduleId: string, cardData: Word) => {
        if (!cardData.name.trim() || !cardData.translation.trim()) {
            toast.error("Заполните слово и перевод");
            return;
        }

        const newCard: Word = {
            id: Date.now().toString(),
            name: cardData.name,
            translation: cardData.translation,
            ipa: cardData.ipa || "",
        };

        setModules((prevModules) => {
            const updatedModules = prevModules.map((m) => {
                if (m.id === moduleId) {
                    const updatedWords = [...m.words, newCard];
                    return {
                        ...m,
                        words: updatedWords,
                        wordCount: updatedWords.length,
                    };
                }
                return m;
            });

            localStorage.setItem("modules", JSON.stringify(updatedModules));
            return updatedModules;
        });

        toast.success("Карточка добавлена!");
    };

    const deleteCard = (moduleId: string, cardId: string) => {
        setModules((prevModules) => {
            const updatedModules = prevModules.map((m) => {
                if (m.id === moduleId) {
                    const updatedWords = m.words.filter((w) => w.id !== cardId);
                    return {
                        ...m,
                        words: updatedWords,
                        wordCount: updatedWords.length,
                    };
                }
                return m;
            });

            localStorage.setItem("modules", JSON.stringify(updatedModules));
            return updatedModules;
        });

        toast.success("Карточка удалена");
    };

    return (
        <ModulesContext.Provider
            value={{
                modules,
                moduleTitle,
                currentModuleWords,
                setModuleId,
                createModule,
                addCard,
                deleteCard,
            }}
        >
            {children}
        </ModulesContext.Provider>
    );
}

export function useModulesContext() {
    const context = useContext(ModulesContext);
    if (context === undefined) {
        throw new Error("useModulesContext must be used within a ModulesProvider");
    }
    return context;
}
