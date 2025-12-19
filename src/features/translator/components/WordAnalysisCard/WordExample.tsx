export default function WordExample({
    sentence,
    translation,
}: {
    sentence: string;
    translation: string;
}) {
    return (
        <div className="max-w-[80vw] sm:max-w-full wrap-break-word bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm sm:text-base italic truncate hover:overflow-x-auto toggle-scrollbar">
                &ldquo;{sentence}&rdquo;
            </p>
            <p className="text-sm text-muted-foreground">{translation}</p>
        </div>
    );
}
