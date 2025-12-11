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
    };

    return (
        <div className="space-y-3 w-full">
            {" "}
            <h3 className="font-semibold">Произношение</h3>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                        IPA:
                    </span>
                    <code className="px-2 py-1 bg-muted rounded text-sm break-all">
                        {ipa}
                    </code>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap shrink-0">
                        Произношение:
                    </span>

                    <span className="text-sm font-medium break-all">
                        {pronunciation}
                    </span>
                </div>

                <div className="flex pt-1">
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
        </div>
    );
}
