import { Tabs, TabsTrigger, TabsContent, TabsList } from "@/components/ui/tabs";
import { WordData } from "@/types/translatorTypes";

export default function WordPartsOfSpeech({
    parts,
}: {
    parts: WordData["partsOfSpeech"];
}) {
    return (
        <div className="space-y-3">
            <h3 className="font-semibold">Части речи</h3>
            <Tabs defaultValue="0" className="w-full">
                <TabsList className="w-full sm:w-auto overflow-x-auto justify-start">
                    {parts.map((pos, index) => (
                        <TabsTrigger key={index} value={index.toString()}>
                            {pos.type}
                        </TabsTrigger>
                    ))}
                </TabsList>
                {parts.map((pos, index) => (
                    <TabsContent
                        key={index}
                        value={index.toString()}
                        className="space-y-2 mt-4"
                    >
                        <p className="text-sm">{pos.meaning}</p>
                        <div className="max-w-[80vw] sm:max-w-full wrap-break-word bg-muted/50 rounded-lg p-4 space-y-2">
                            <p className="text-sm sm:text-base italic truncate hover:overflow-x-auto hover:scrollbar-thin hover:scrollbar-thumb-rounded hover:scrollbar-thumb-gray-500 hover:scrollbar-track-gray-200 dark:hover:scrollbar-thumb-gray-400 dark:hover:scrollbar-track-gray-800">
                                &ldquo;{pos.example}&rdquo;
                            </p>
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
