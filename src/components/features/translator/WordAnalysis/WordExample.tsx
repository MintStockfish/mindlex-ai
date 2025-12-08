export default function WordExample({
    sentence,
    translation,
}: {
    sentence: string;
    translation: string;
}) {
    return (
        <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="italic">&ldquo;{sentence}&rdquo;</p>
            <p className="text-sm text-muted-foreground">{translation}</p>
        </div>
    );
}