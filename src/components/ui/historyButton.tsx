import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { History } from "lucide-react";

export function HistoryButton({
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <Button
            type="button"
            className={cn(
                "h-full aspect-square p-0 rounded-lg transition-all",
                "bg-[#0f172a] hover:bg-[#1e293b] border-2 border-slate-800",
                "active:scale-95 shadow-lg",
                "flex items-center justify-center shrink-0",
                className,
            )}
            {...props}
        >
            <History
                style={{ width: "30px", height: "30px" }}
                className={cn("text-white transition-opacity")}
            />
        </Button>
    );
}
