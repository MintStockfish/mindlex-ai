import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Module, Word } from "@/types/flashcardsTypes";

export const useModules = (id?: string) => {
    const [modules, setModules] = useState<Module[]>([]);
    const [moduleTitle, setModuleTitle] = useState<null | string>(null);
    const [currentModuleWords, setCurrentModuleWords] = useState<Word[]>([]);

    useEffect(() => {
        const storedItem = localStorage.getItem("modules");
        const userModules: Module[] = storedItem ? JSON.parse(storedItem) : [];
        setModules(userModules);
    }, []);

    useEffect(() => {
        if (id && modules.length > 0) {
            const currentModule = modules.find((module) => module.id === id);
            if (currentModule) {
                setModuleTitle(currentModule.title);
                setCurrentModuleWords(currentModule.words);
            }
        }
    }, [id, modules]);

    const createModule = (data: { title: string; description?: string }) => {
        if (!data.title.trim()) {
            toast.error("Введите название модуля");
            return;
        }

        let nextId = "1";
        if (modules.length > 0) {
            const lastModuleId = modules[modules.length - 1].id;
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

        const updatedModules = [...modules, createdModule];
        setModules(updatedModules);
        localStorage.setItem("modules", JSON.stringify(updatedModules));

        toast.success("Модуль создан!", {
            description: "Теперь вы можете добавить в него карточки",
        });
    };

    const addCard = (
        moduleId: string,
        cardData: { word: string; translation: string; transcription?: string }
    ) => {
        if (!cardData.word.trim() || !cardData.translation.trim()) {
            toast.error("Заполните слово и перевод");
            return;
        }

        const newCard: Word = {
            id: Date.now().toString(),
            name: cardData.word,
            translation: cardData.translation,
            ipa: cardData.transcription || "",
        };

        const updatedModules = modules.map((m) => {
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

        setModules(updatedModules);
        localStorage.setItem("modules", JSON.stringify(updatedModules));
        toast.success("Карточка добавлена!");
    };

    const deleteCard = (moduleId: string, cardId: string) => {
        const updatedModules = modules.map((m) => {
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

        setModules(updatedModules);
        localStorage.setItem("modules", JSON.stringify(updatedModules));
        toast.success("Карточка удалена");
    };

    return {
        modules,
        moduleTitle,
        currentModuleWords,
        createModule,
        addCard,
        deleteCard,
    };
};
