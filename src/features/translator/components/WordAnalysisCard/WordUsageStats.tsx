import { Progress } from "@/components/ui/progress";
import { WordData } from "@/features/translator/types/types";

export default function WordUsageStats({
    usage,
}: {
    usage: WordData["usage"];
}) {
    const stats = [
        { label: "Неформальный", value: usage.informal },
        { label: "Нейтральный", value: usage.neutral },
        { label: "Формальный", value: usage.formal },
    ];

    return (
        <div className="space-y-3">
            <h3 className="font-semibold">Стиль использования</h3>
            <div className="space-y-4">
                {stats.map((stat) => (
                    <div key={stat.label} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                {stat.label}
                            </span>
                            <span>{stat.value}%</span>
                        </div>
                        {stat.value !== undefined && (
                            <Progress value={+stat.value} className="h-2" />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
