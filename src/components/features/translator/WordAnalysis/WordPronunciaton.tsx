import { Button } from "@/components/ui/button";
import { Volume2 } from "lucide-react";

export default function WordPronunciation({
    ipa,
    pronunciation,
}: {
    ipa: string;
    pronunciation: string;
}) {
    const playPronunciation = () => {
        console.log("Playing pronunciation...");
        // Тут можно добавить реальную логику воспроизведения
    };

    return (
        <div className="space-y-3">
            <h3 className="font-semibold">Произношение</h3>
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">IPA:</span>
                    <code className="px-2 py-1 bg-muted rounded text-sm">
                        {ipa}
                    </code>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Русскими:
                    </span>
                    <span className="text-sm">{pronunciation}</span>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={playPronunciation}
                    className="gap-2"
                >
                    <Volume2 className="h-4 w-4" />
                    Прослушать
                </Button>
            </div>
        </div>
    );
}