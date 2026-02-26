import { useState } from "react";
import { ArrowRightLeft, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HistoryButton } from "@/components/ui/historyButton";
import { Input } from "@/components/ui/input";
import { Selector } from "@/components/ui/selector";
import { GenerateButton } from "@/components/ui/translateButton";
import { useInputFocus } from "@/features/translator/contexts/InputContext";
import { cn } from "@/lib/utils";

import HistoryDialog from "../History/HistoryDialog";

import { HistoryItem } from "@/features/translator/types/types";

interface TranslatorSearchProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    sourceLang: string;
    targetLang: string;
    setSourceLang: (lang: string) => void;
    setTargetLang: (lang: string) => void;
    sourcePlaceholder: string;
    targetPlaceholder: string;
    swapLanguages: () => void;
    onHistorySelect: (item: HistoryItem) => void;
}

const LANGUAGES = [
    "English",
    "Russian",
    "Spanish",
    "French",
    "German",
    "Italian",
    "Portuguese",
    "Chinese",
    "Japanese",
    "Korean",
    "Turkish",
    "Arabic",
    "Hindi",
    "Dutch",
    "Polish",
];

export default function TranslatorSearch({
    value,
    onChange,
    onSubmit,
    isLoading,
    sourceLang,
    targetLang,
    setSourceLang,
    setTargetLang,
    sourcePlaceholder,
    targetPlaceholder,
    swapLanguages,
    onHistorySelect,
}: TranslatorSearchProps) {
    const { inputRef } = useInputFocus();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const openHistory = () => {
        setIsDialogOpen(true);
    };

    return (
        <form onSubmit={onSubmit} className="mb-8 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between z-20 relative">
                <div className="w-full sm:w-[45%]">
                    <Selector
                        value={sourceLang}
                        excludeValue={targetLang}
                        onChange={setSourceLang}
                        label={sourcePlaceholder}
                        disabled={isLoading}
                        options={LANGUAGES}
                    />
                </div>

                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={swapLanguages}
                    className="shrink-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                    disabled={isLoading}
                >
                    <ArrowRightLeft className="h-5 w-5 text-muted-foreground" />
                </Button>

                <div className="w-full sm:w-[45%]">
                    <Selector
                        value={targetLang}
                        excludeValue={sourceLang}
                        onChange={setTargetLang}
                        label={targetPlaceholder}
                        disabled={isLoading}
                        options={LANGUAGES}
                    />
                </div>
            </div>

            <div className="flex gap-2 relative z-10 h-[60px]">
                <HistoryButton onClick={openHistory} className="h-full" />
                <div className="relative flex-1 h-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                    <Input
                        type="text"
                        placeholder={`Type in ${
                            sourceLang || sourcePlaceholder
                        }...`}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={isLoading}
                        ref={inputRef}
                        className={cn(
                            "pl-12 pr-4 h-full text-xl bg-card border-2 transition-[box-shadow,transform,border-color] w-full",
                            "border-slate-300 dark:border-slate-700",
                            "hover:border-[#06b6d4]/50 dark:hover:border-[#06b6d4]/50",
                            "focus-visible:border-[#06b6d4]",
                        )}
                    />
                </div>
                <GenerateButton
                    isLoading={isLoading}
                    onClick={onSubmit}
                    className="h-full"
                />
            </div>

            <HistoryDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onSelect={onHistorySelect}
            />
        </form>
    );
}
