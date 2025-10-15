"use client";

import { useState } from "react";
import { Plus, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Module {
  id: string;
  title: string;
  description: string;
  wordCount: number;
}

export default function Cards() {
  const navigate = useRouter();
  const [modules, setModules] = useState<Module[]>([
    {
      id: "1",
      title: "Испанский: Базовые глаголы",
      description: "Самые употребляемые глаголы в испанском языке",
      wordCount: 45,
    },
    {
      id: "2",
      title: "Английский: IT-термины",
      description: "Технические термины для программистов",
      wordCount: 68,
    },
    {
      id: "3",
      title: "Французский: Путешествия",
      description: "Полезные фразы для путешественников",
      wordCount: 33,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
  });

  const handleCreateModule = () => {
    if (!newModule.title.trim()) {
      toast.error("Введите название модуля");
      return;
    }

    const createdModule: Module = {
      id: Date.now().toString(),
      title: newModule.title,
      description: newModule.description,
      wordCount: 0,
    };

    setModules([...modules, createdModule]);
    setNewModule({ title: "", description: "" });
    setIsDialogOpen(false);
    toast.success("Модуль создан!", {
      description: "Теперь вы можете добавить в него карточки",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl py-8 sm:py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl mb-2">Мои модули</h1>
          <p className="text-muted-foreground">
            Создавайте модули карточек для эффективного изучения слов
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity">
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
                  placeholder="Например: Английский: Деловая лексика"
                  value={newModule.title}
                  onChange={(e) =>
                    setNewModule({ ...newModule, title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Описание (опционально)</Label>
                <Textarea
                  id="description"
                  placeholder="Краткое описание модуля..."
                  value={newModule.description}
                  onChange={(e) =>
                    setNewModule({ ...newModule, description: e.target.value })
                  }
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Отмена
              </Button>
              <Button
                onClick={handleCreateModule}
                className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
              >
                Создать
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Modules Grid */}
      {modules.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-r from-[#06b6d4]/20 to-[#3b82f6]/20 flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-[#06b6d4]" />
          </div>
          <h3 className="mb-2">Нет модулей</h3>
          <p className="text-muted-foreground max-w-md mb-6">
            Создайте свой первый модуль, чтобы начать добавлять и изучать
            карточки
          </p>
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4 mr-2" />
            Создать модуль
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => (
            <Card
              key={module.id}
              className="group cursor-pointer hover:shadow-lg hover:border-[#06b6d4]/50 transition-all duration-300 hover:-translate-y-1"
              onClick={() => navigate.push(`/module/${module.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="line-clamp-2 mb-2">
                      {module.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {module.description || "Без описания"}
                    </CardDescription>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-[#06b6d4] transition-colors shrink-0" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {module.wordCount}{" "}
                    {module.wordCount === 1 ? "слово" : "слов"}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
