"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { HistoryItem } from "../types/types";

const HISTORY_STORAGE_KEY = "mindlex_history";
const MAX_HISTORY_ITEMS = 50;

interface HistoryContextType {
    history: HistoryItem[];
    addToHistory: (item: Omit<HistoryItem, "id" | "timestamp">) => void;
    clearHistory: () => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
        if (saved) {
            try {
                setHistory(JSON.parse(saved));
            } catch (e) {
                console.error("Ошибка при извлечении истории", e);
                localStorage.removeItem(HISTORY_STORAGE_KEY);
            }
        }
    }, []);

    const addToHistory = useCallback(
        (item: Omit<HistoryItem, "id" | "timestamp">) => {
            setHistory((prev) => {
                const filtered = prev.filter(
                    (h) =>
                        !(
                            h.query.toLowerCase() ===
                                item.query.toLowerCase() &&
                            h.sourceLang === item.sourceLang &&
                            h.targetLang === item.targetLang &&
                            h.type === item.type
                        ),
                );

                const newItem: HistoryItem = {
                    ...item,
                    id: crypto.randomUUID(),
                    timestamp: Date.now(),
                };

                const newHistory = [newItem, ...filtered].slice(
                    0,
                    MAX_HISTORY_ITEMS,
                );

                localStorage.setItem(
                    HISTORY_STORAGE_KEY,
                    JSON.stringify(newHistory),
                );
                return newHistory;
            });
        },
        [],
    );

    const clearHistory = useCallback(() => {
        setHistory([]);
        localStorage.removeItem(HISTORY_STORAGE_KEY);
    }, []);

    return (
        <HistoryContext.Provider
            value={{ history, addToHistory, clearHistory }}
        >
            {children}
        </HistoryContext.Provider>
    );
}

export function useHistory() {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error(
            "useHistory должен использоваться внутри HistoryProvider!",
        );
    }
    return context;
}
