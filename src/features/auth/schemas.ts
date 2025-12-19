import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Неверный формат email"),
    password: z
        .string()
        .min(1, "Пароль обязателен")
        .min(6, "Пароль должен содержать минимум 6 символов"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        name: z.string().min(1, "Имя обязательно для заполнения"),
        email: z.email("Неверный формат email"),
        password: z
            .string()
            .min(6, "Пароль должен содержать минимум 6 символов"),
        confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
    })

    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

export type RegisterSchema = z.infer<typeof registerSchema>;
