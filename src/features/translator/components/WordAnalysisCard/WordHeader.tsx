import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Selector } from "@/components/ui/selector";
import { useModulesContext } from "@/features/flashcards/contexts/ModulesContext";
import { Word } from "@/features/flashcards/types";

export default function WordHeader({
    word,
    translation,
    ipa,
    onAdd,
}: {
    word: string;
    translation: string;
    ipa: string;
    onAdd: () => void;
}) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedModuleId, setSelectedModuleId] = useState<string>("");
    const [newModule, setNewModule] = useState({
        title: "",
        description: "",
    });
    const { modules, createModule, addCard } = useModulesContext();

    const handleSave = () => {
        const newWord: Word = {
            id: Date.now().toString(),
            name: word,
            translation,
            ipa,
        };

        const title = newModule.title.trim();

        if (selectedModuleId) {
            addCard(selectedModuleId, newWord);
            setIsDialogOpen(false);
            setSelectedModuleId("");
        } else if (title) {
            const moduleId = createModule({
                title,
                description: newModule.description,
            });

            if (moduleId) {
                addCard(moduleId, newWord);
            }

            setNewModule({ title: "", description: "" });
            setIsDialogOpen(false);
            setIsCreating(false);
        } else {
            toast.error("Выберите модуль или создайте новый");
        }
    };

    const moduleOptions = modules.map((m) => m.title);

    return (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0 w-full">
                {" "}
                <h2 className="text-3xl sm:text-4xl bg-linear-to-r from-[#06b6d4] to-[#3b82f6] bg-clip-text text-transparent mb-2 wrap-break-word hyphens-auto">
                    {translation}
                </h2>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="italic break-all">{word}</span>
                </div>
            </div>

            <Dialog
                open={isDialogOpen}
                onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) setIsCreating(false);
                }}
            >
                <DialogTrigger asChild>
                    <Button
                        onClick={onAdd}
                        className="w-full sm:w-auto bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity shrink-0"
                    >
                        <Plus className="h-4 w-4 mr-2" />В карточки
                    </Button>
                </DialogTrigger>
                <DialogContent
                    className="sm:max-w-[500px]"
                    onOpenAutoFocus={(e) => e.preventDefault()}
                >
                    <DialogHeader>
                        <DialogTitle>Выберите модуль</DialogTitle>
                        <DialogDescription>
                            Выберите или создайте модуль, чтобы сохранить туда
                            слово.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-2 space-y-4">
                        <div className="space-y-2">
                            <Label>Модули</Label>
                            <Selector
                                value={
                                    modules.find(
                                        (m) => m.id === selectedModuleId
                                    )?.title || ""
                                }
                                onChange={(title: string) => {
                                    console.log("[TEST]: SELECTOR CHANGED");
                                    const mod = modules.find(
                                        (m) => m.title === title
                                    );
                                    if (mod) setSelectedModuleId(mod.id);
                                }}
                                options={moduleOptions}
                                label="Выберите модуль..."
                            />
                        </div>

                        <div className="relative flex items-center justify-center my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200 dark:border-slate-800" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Или
                                </span>
                            </div>
                        </div>

                        {!isCreating ? (
                            <Button
                                variant="outline"
                                className="w-full border-dashed"
                                onClick={() => setIsCreating(true)}
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Создать новый модуль
                            </Button>
                        ) : (
                            <div className="space-y-4 rounded-lg border border-slate-200 dark:border-slate-800 p-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="space-y-2">
                                    <Label htmlFor="title">
                                        Название модуля
                                    </Label>
                                    <Input
                                        id="title"
                                        placeholder="Например: Английский: Деловая лексика"
                                        value={newModule.title}
                                        onChange={(e) =>
                                            setNewModule({
                                                ...newModule,
                                                title: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Описание (опционально)
                                    </Label>
                                    <Textarea
                                        id="description"
                                        placeholder="Краткое описание модуля..."
                                        value={newModule.description}
                                        onChange={(e) =>
                                            setNewModule({
                                                ...newModule,
                                                description: e.target.value,
                                            })
                                        }
                                        rows={3}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Отмена
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                        >
                            Добавить
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
