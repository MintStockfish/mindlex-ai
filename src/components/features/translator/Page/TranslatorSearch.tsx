import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/components/ui/utils";
import { useInputFocus } from "@/contexts/InputFocusContext";

interface TranslatorSearchProps {
    value: string;
    onChange: (val: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
}

export default function TranslatorSearch({
    value,
    onChange,
    onSubmit,
    isLoading,
}: TranslatorSearchProps) {
    const { inputRef } = useInputFocus();

    return (
        <form onSubmit={onSubmit} className="mb-8">
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Введите слово или предложение..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    disabled={isLoading}
                    ref={inputRef}
                    className={cn(
                        "pl-12 pr-4 py-6 text-lg bg-card border-2 transition-colors",
                        "border-slate-300 dark:border-slate-700",
                        "hover:border-[#06b6d4]/50 dark:hover:border-[#06b6d4]/50",
                        "focus-visible:border-[#06b6d4]"
                    )}
                />
            </div>
        </form>
    );
}
