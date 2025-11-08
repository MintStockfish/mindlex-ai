"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod";
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
import { loginSchema } from "@/validations/authorization";

export default function Login() {
    const navigate = useRouter();
    const { login } = useAuth();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = loginSchema.safeParse(formData);

        if (!result.success) {
            const flattenedErrors = z.flattenError(result.error);

            const { fieldErrors } = flattenedErrors;

            const allErrors = Object.values(fieldErrors).flat();

            allErrors.forEach((errorMessage) => {
                if (errorMessage) {
                    toast.error(errorMessage);
                }
            });

            return;
        }

        setIsLoading(true);
        const success = await login(result.data.email, result.data.password);
        setIsLoading(false);

        if (success) {
            toast.success("Добро пожаловать!");
            navigate.replace("/");
        } else {
            toast.error("Неверный email или пароль");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-background via-background to-[#06b6d4]/5">
            <div className="w-full max-w-md">
                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity justify-center mb-8"
                >
                    <MindlexLogo />
                </Link>

                {/* Login Card */}
                <Card className="border-2">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            Вход в систему
                        </CardTitle>
                        <CardDescription className="text-center">
                            Введите свои данные для входа
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
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
                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Вход...
                                    </>
                                ) : (
                                    "Войти"
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm">
                            <span className="text-muted-foreground">
                                Нет аккаунта?{" "}
                            </span>
                            <Link
                                href="/register"
                                className="text-[#06b6d4] hover:underline transition-colors"
                            >
                                Зарегистрироваться
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Demo Info */}
                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground text-center">
                    <p className="mb-2">
                        Демо-версия. Для тестирования можете создать новый
                        аккаунт.
                    </p>
                    <p className="text-xs">
                        Данные сохраняются локально в браузере
                    </p>
                </div>
            </div>
        </div>
    );
}
