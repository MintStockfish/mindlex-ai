import { BookOpen } from "lucide-react";

export default function WordEtymology({ text }: { text: string }) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[#06b6d4]" />
                <h3 className="font-semibold">Происхождение (Этимология)</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
                {text}
            </p>
        </div>
    );
}