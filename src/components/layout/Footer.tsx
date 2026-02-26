"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Footer() {
    const pathname = usePathname();

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <footer className="w-full border-t mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <div className="flex flex-col items-center justify-center py-6 gap-4">
                    <p className="text-sm text-muted-foreground text-center">
                        © 2025 Mindlex AI. Изучайте языки с помощью
                        искусственного интеллекта.
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            О проекте
                        </Link>
                        <span className="text-muted-foreground">•</span>
                        <Link
                            href="#"
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Поддержка
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
