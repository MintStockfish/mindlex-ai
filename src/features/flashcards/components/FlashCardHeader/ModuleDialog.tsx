import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModules } from "../../hooks/useModules";

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
import { FlashCardHeaderProps } from "../../types";

export default function ModuleDialog({
    isDialogOpen,
    setIsDialogOpen,
}: FlashCardHeaderProps) {
    const { createModule } = useModules();
    const [newModule, setNewModule] = useState({
        title: "",
        description: "",
    });

    const handleCreate = () => {
        createModule(newModule);
        setIsDialogOpen(false);
        setNewModule({ title: "", description: "" });
    };

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity">
                    <Plus className="h-4 w-4 mr-2" />
                    Добавить модуль
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Создать новый модуль</DialogTitle>
                    <DialogDescription>
                        Создайте модуль для группировки слов по темам
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Название модуля</Label>
                        <Input
                            id="title"
                            placeholder='Например: "Английский: Деловая лексика"'
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
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleCreate}
                        className="bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                    >
                        Создать
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
