"use client";

import { Trash2, ArrowRight, FileText } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useHistory } from "@/features/translator/contexts/ContextHistory";
import { HistoryItem } from "@/features/translator/types/types";
import { cn } from "@/lib/utils";

interface HistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (item: HistoryItem) => void;
}

export default function HistoryDialog({
    open,
    onOpenChange,
    onSelect,
}: HistoryDialogProps) {
    const { history, clearHistory } = useHistory();

    const handleSelect = (item: HistoryItem) => {
        onSelect(item);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[85vh]">
                <DialogHeader>
                    <div className="flex items-center justify-between pr-4">
                        <DialogTitle className="text-xl font-bold">
                            История переводов
                        </DialogTitle>
                        {history.length > 0 && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearHistory}
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 px-2"
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Очистить
                            </Button>
                        )}
                    </div>
                    <DialogDescription>
                        Выбери запись, чтобы восстановить результат перевода.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-2 -mr-2 mt-4 space-y-3 custom-scrollbar">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                            <div className="mb-4 p-4 bg-slate-100 dark:bg-slate-800 rounded-full opacity-50">
                                <FileText className="w-8 h-8" />
                            </div>
                            <p>История пуста...</p>
                            <p className="text-sm">
                                Переведи что-нибудь, и оно появится здесь!
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <Card
                                key={item.id}
                                onClick={() => handleSelect(item)}
                                className={cn(
                                    "p-4 cursor-pointer transition-all duration-200",
                                    "hover:border-[#06b6d4] hover:shadow-md",
                                    "active:scale-[0.99]",
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-2">
                                        <Badge
                                            variant="outline"
                                            className="font-mono text-xs"
                                        >
                                            {item.sourceLang
                                                .slice(0, 2)
                                                .toUpperCase()}
                                            <ArrowRight className="w-3 h-3 mx-1 inline" />
                                            {item.targetLang
                                                .slice(0, 2)
                                                .toUpperCase()}
                                        </Badge>
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "text-xs",
                                                item.type === "word"
                                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
                                            )}
                                        >
                                            {item.type === "word"
                                                ? "Слово"
                                                : "Фраза"}
                                        </Badge>
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(
                                            item.timestamp,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>

                                <p className="font-medium text-lg truncate mb-1">
                                    {item.query} -&gt;{" "}
                                    <span className="text-muted-foreground">
                                        {item.data.translation}
                                    </span>
                                </p>
                            </Card>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
