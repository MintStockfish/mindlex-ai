import { getBadgeColor } from "../../utils/colorizeUtil";
import { Badge } from "@/components/ui/badge";

export const GrammarLegend = ({
    partsOfSpeech,
}: {
    partsOfSpeech: string[];
}) => {
    if (partsOfSpeech.length === 0) return null;

    return (
        <div className="space-y-3">
            <h3>Части речи</h3>
            <div className="flex flex-wrap gap-2">
                {partsOfSpeech.map((pos) => (
                    <Badge
                        key={pos}
                        variant="outline"
                        className={getBadgeColor(pos)}
                    >
                        {pos}
                    </Badge>
                ))}
            </div>
            <p className="text-sm text-muted-foreground">
                Нажмите на любое слово в предложении для детального разбора
            </p>
        </div>
    );
};
