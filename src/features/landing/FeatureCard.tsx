import { ArrowRight, LucideIcon } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    tags: string[];
    iconGradient: string;
    hoverOverlay: string;
}

export const FeatureCard = ({
    title,
    description,
    icon: Icon,
    tags,
    iconGradient,
    hoverOverlay,
}: FeatureCardProps) => {
    return (
        <Card className="group cursor-pointer hover:shadow-xl hover:border-[#06b6d4]/50 transition-all duration-300 hover:-translate-y-2 overflow-hidden relative">
            <div
                className={cn(
                    "absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity to-transparent",
                    hoverOverlay
                )}
            />

            <CardHeader>
                <div
                    className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform bg-linear-to-r",
                        iconGradient
                    )}
                >
                    <Icon className="h-6 w-6 text-white" />
                </div>

                <CardTitle className="flex items-center justify-between">
                    {title}
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#06b6d4] group-hover:translate-x-1 transition-all" />
                </CardTitle>

                <CardDescription>{description}</CardDescription>
            </CardHeader>

            <CardContent>
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <div
                            key={tag}
                            className="px-3 py-1 rounded-full bg-muted text-xs"
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};
