"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { MindlexLogo } from "@/components/MindlexLogo";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Register() {
    const navigate = useRouter();
    const { register } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            toast.error("Заполните все поля");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error("Пароли не совпадают");
            return;
        }

        if (formData.password.length < 6) {
            toast.error("Пароль должен содержать минимум 6 символов");
            return;
        }

        setIsLoading(true);
        const success = await register(
            formData.email,
            formData.password,
            formData.name
        );
        setIsLoading(false);

        if (success) {
            toast.success("Аккаунт создан успешно!");
            navigate.replace("/");
        } else {
            toast.error("Пользователь с таким email уже существует");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-[#06b6d4]/5">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <MindlexLogo />
                </div>

                {/* Register Card */}
                <Card className="border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            Регистрация
                        </CardTitle>
                        <CardDescription className="text-center">
                            Создайте аккаунт для начала обучения
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Имя</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Иван Иванов"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="example@mail.com"
                                    value={formData.email}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            email: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Пароль</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            password: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">
                                    Подтвердите пароль
                                </Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                    disabled={isLoading}
                                />
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Создание аккаунта...
                                    </>
                                ) : (
                                    "Зарегистрироваться"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">
                                Уже есть аккаунт?{" "}
                            </span>
                            <Link
                                href="/login"
                                className="text-[#06b6d4] hover:underline transition-colors"
                            >
                                Войти
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Info */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
                    <p className="text-xs">
                        Данные сохраняются локально в браузере
                    </p>
                </div>
            </div>
        </div>
    );
}
