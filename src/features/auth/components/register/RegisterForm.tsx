"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/features/auth/contexts/context";
import { registerSchema } from "@/features/auth/validations/schemas";

function RegisterForm() {
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

        const result = registerSchema.safeParse(formData);

        if (!result.success) {
            const flattenedErrors = z.flattenError(result.error);

            const allErrors = [
                ...flattenedErrors.formErrors,
                ...Object.values(flattenedErrors.fieldErrors).flat(),
            ];

            allErrors.forEach((errorMessage) => {
                if (errorMessage) toast.error(errorMessage);
            });

            return;
        }

        setIsLoading(true);

        const success = await register(
            result.data.name,
            result.data.email,
            result.data.password,
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
                        className="w-full bg-linear-to-r from-[#06b6d4] to-[#3b82f6] hover:opacity-90 transition-opacity"
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
    );
}

export default RegisterForm;
