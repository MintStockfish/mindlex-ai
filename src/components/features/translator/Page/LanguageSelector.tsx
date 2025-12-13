import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/components/ui/utils";
import { Input } from "@/components/ui/input";

interface LanguageSelectorProps {
    value: string;
    excludeValue?: string;
    onChange: (val: string) => void;
    label?: string;
    disabled?: boolean;
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

export default function LanguageSelector({
    value,
    onChange,
    excludeValue,
    label = "Select language...",
    disabled = false,
}: LanguageSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(value);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setSearchTerm(value);
    }, [value]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setSearchTerm(newValue);
        onChange(newValue);
        setIsOpen(true);
    };

    const handleSelect = (lang: string) => {
        onChange(lang);
        setSearchTerm(lang);
        setIsOpen(false);
    };

    const handleFocus = () => {
        if (!disabled) setIsOpen(true);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    const filteredLanguages = useMemo(() => {
        const normalizedSearch = searchTerm.toLowerCase();
        const normalizedExcludeValue = excludeValue?.toLowerCase();

        return LANGUAGES.filter((lang) => {
            const normalizedLang = lang.toLowerCase();

            return (
                normalizedLang !== normalizedExcludeValue &&
                normalizedLang.includes(normalizedSearch)
            );
        });
    }, [searchTerm, excludeValue]);

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <Input
                    ref={inputRef}
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onKeyDown={handleKeyDown}
                    placeholder={label}
                    disabled={disabled}
                    className={cn(
                        "w-full pr-10 py-6 text-base bg-card border-2 transition-colors",
                        "border-slate-300 dark:border-slate-700",
                        "hover:border-[#06b6d4]/50 dark:hover:border-[#06b6d4]/50",
                        "focus-visible:border-[#06b6d4]",
                        isOpen && "border-[#06b6d4] ring-1 ring-[#06b6d4]"
                    )}
                />
                <div
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground hover:text-foreground transition-colors"
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                >
                    <ChevronDown
                        className={cn(
                            "h-5 w-5 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-50 w-full mt-2 bg-card border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    <div className="p-1">
                        {filteredLanguages.length > 0 ? (
                            filteredLanguages.map((lang) => {
                                return (
                                    <button
                                        key={lang}
                                        type="button"
                                        onClick={() => handleSelect(lang)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors",
                                            "hover:bg-accent hover:text-accent-foreground",
                                            value === lang &&
                                                "bg-accent/50 text-accent-foreground font-medium"
                                        )}
                                    >
                                        {lang}
                                        {value === lang && (
                                            <Check className="h-4 w-4 text-[#06b6d4]" />
                                        )}
                                    </button>
                                );
                            })
                        ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground text-center">
                                Custom language: &quot;{searchTerm}&quot;
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
