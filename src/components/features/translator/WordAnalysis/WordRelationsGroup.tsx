export default function WordRelationsGroup({
    title,
    items,
}: {
    title: string;
    items: { word: string; ipa: string }[];
}) {
    if (!items?.length) return null;

    return (
        <div className="space-y-3">
            <h3 className="font-semibold">{title}</h3>
            <div className="flex flex-wrap gap-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="group bg-muted/50 hover:bg-muted rounded-lg px-3 py-2 transition-colors cursor-pointer border border-transparent hover:border-border"
                    >
                        <p className="text-sm font-medium">{item.word}</p>
                        <p className="text-xs text-muted-foreground">
                            {item.ipa}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}