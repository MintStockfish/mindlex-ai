import { Search } from "lucide-react";

export default function TranslatorWelcome() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 mb-6 rounded-full bg-linear-to-r from-[#06b6d4]/20 to-[#3b82f6]/20 flex items-center justify-center">
                <Search className="h-12 w-12 text-[#06b6d4]" />
            </div>
            <h3 className="mb-2 text-xl font-semibold">Начните изучение</h3>
            <p className="text-muted-foreground max-w-md">
                Введите любое слово или предложение, и ИИ предоставит детальный
                разбор.
            </p>
        </div>
    );
}
