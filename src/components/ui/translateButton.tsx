import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; 

interface GenerateButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
}

export function GenerateButton({
    isLoading,
    className,
    disabled,
    ...props
}: GenerateButtonProps) {
    return (
        <Button
            type="submit"
            disabled={isLoading || disabled}
            className={cn(
                "h-full aspect-square p-0 rounded-lg transition-all",
                "bg-[#0f172a] hover:bg-[#1e293b] border-2 border-slate-800",
                "active:scale-95 shadow-lg",
                "flex items-center justify-center shrink-0",
                isLoading && "animate-pulse cursor-not-allowed opacity-70",
                className
            )}
            {...props}
        >
            <svg
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '30px', height: '30px' }}
                className={cn(
                    "text-white transition-opacity",
                    isLoading ? "opacity-50" : "opacity-100"
                )}
            >
                <circle
                    cx="8"
                    cy="16"
                    r="2.5"
                    fill="currentColor"
                    opacity="0.9"
                />
                <circle cx="16" cy="8" r="2.5" fill="currentColor" />
                <circle cx="16" cy="24" r="2.5" fill="currentColor" />
                <circle
                    cx="24"
                    cy="16"
                    r="2.5"
                    fill="currentColor"
                    opacity="0.9"
                />
                <line
                    x1="8"
                    y1="16"
                    x2="16"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                />
                <line
                    x1="8"
                    y1="16"
                    x2="16"
                    y2="24"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                />
                <line
                    x1="16"
                    y1="8"
                    x2="24"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                />
                <line
                    x1="16"
                    y1="24"
                    x2="24"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="2"
                    opacity="0.8"
                />
                <path
                    d="M16 4C12.5 4 10 6 9 8C8 7.5 7 7 6 7.5C4.5 8 4 9.5 4 11C4 12 4.5 13 5 13.5C4.5 14 4 15 4 16C4 17.5 5 18.5 6 19C5.5 19.5 5 20.5 5 21.5C5 23 6 24 7.5 24.5C8 24.7 8.5 25 9 25C10 27 12.5 28 16 28C19.5 28 22 27 23 25C23.5 25 24 24.7 24.5 24.5C26 24 27 23 27 21.5C27 20.5 26.5 19.5 26 19C27 18.5 28 17.5 28 16C28 15 27.5 14 27 13.5C27.5 13 28 12 28 11C28 9.5 27.5 8 26 7.5C25 7 24 7.5 23 8C22 6 19.5 4 16 4Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    fill="none"
                />
            </svg>
        </Button>
    );
}
