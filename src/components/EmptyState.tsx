import { useEffect, useState } from "react";
import { cn } from "./ui/utils";

export default function EmptyStateAnimation() {
    const [showMainMessage, setShowMainMessage] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowMainMessage((prev) => !prev);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-30 flex flex-col items-center justify-center overflow-hidden min-h-[200px]">
            <h2
                className={cn(
                    "text-3xl sm:text-4xl bg-linear-to-r from-[#900429] to-[#3b82f6] bg-clip-text text-transparent mb-2 text-center transition-all duration-700 ease-in-out",
                    showMainMessage
                        ? "opacity-100 translate-y-0 blur-none"
                        : "opacity-0 translate-y-8 blur-sm"
                )}
            >
                Looks like your input is not worth to translate.
            </h2>

            <hr className="w-full my-4 border-border/50" />

            <h6
                className={cn(
                    "text-1xl text-[#ff039f]/50 mb-2 text-center transition-all duration-700 ease-in-out",
                    !showMainMessage
                        ? "opacity-100 translate-y-0 blur-none"
                        : "opacity-0 translate-y-8 blur-sm"
                )}
            >
                Or maybe it&apos;s on me.
            </h6>
        </div>
    );
}
