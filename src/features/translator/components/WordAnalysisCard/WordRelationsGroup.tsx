import { useInputFocus } from "@/features/translator/context";

interface WordItem {
    word: string;
    ipa?: string;
}

interface WordRelationsGroupProps {
    title: string;
    items: WordItem[];
}

export default function WordRelationsGroup({
    title,
    items,
}: WordRelationsGroupProps) {
    const { inputRef, setQuery } = useInputFocus();

    const handleItemClick = (word: string) => {
        setQuery(word);
        inputRef.current?.focus();
    };

    if (!items?.length) return null;

    return (
        <div className="space-y-3">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <button
                        key={item.word}
                        className="group bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 transition-colors cursor-pointer border border-transparent hover:border-border"
                        onClick={() => {
                            handleItemClick(item.word);
                        }}
                    >
                        <p className="text-sm font-medium">{item.word}</p>
                        {item.ipa && (
                            <p className="text-xs text-muted-foreground">
                                {item.ipa}
                            </p>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
}
