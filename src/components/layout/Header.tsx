"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Moon, Sun, LogOut, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MindlexLogo } from "@/components/ui/MindlexLogo";
import { useAuth } from "@/features/auth/contexts/context";
import { useTheme } from "@/components/shared/ThemeProvider";

export function Header() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();

    const isActive = (path: string) => pathname === path;

    if (pathname === "/login" || pathname === "/register") {
        return null;
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href="/"
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                        <MindlexLogo />
                    </Link>

                    {/* Navigation and Theme Toggle */}
                    <div className="flex items-center gap-6">
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/translator"
                                className={`relative transition-colors hover:text-foreground/80 ${
                                    isActive("/translator")
                                        ? "text-foreground"
                                        : "text-foreground/60"
                                }`}
                            >
                                Переводчик
                                {isActive("/translator") && (
                                    <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-[#06b6d4]" />
                                )}
                            </Link>
                            <Link
                                href="/flashcards"
                                className={`relative transition-colors hover:text-foreground/80 ${
                                    isActive("/flashcards") ||
                                    pathname.startsWith("/module/")
                                        ? "text-foreground"
                                        : "text-foreground/60"
                                }`}
                            >
                                Карточки
                                {(isActive("/flashcards") ||
                                    pathname.startsWith("/module/")) && (
                                    <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-[#06b6d4]" />
                                )}
                            </Link>
                        </nav>

                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="h-9 w-9 hover:bg-accent"
                        >
                            {theme === "light" ? (
                                <Moon className="h-4 w-4" />
                            ) : (
                                <Sun className="h-4 w-4" />
                            )}
                            <span className="sr-only">Переключить тему</span>
                        </Button>

                        {user ? (
                            <Button onClick={logout} variant="ghost" asChild>
                                <Link href="/login">
                                    <LogOut className="h-4 w-4" />
                                    <span className="sr-only">Выйти</span>
                                </Link>
                            </Button>
                        ) : (
                            <Button variant="ghost" asChild>
                                <Link href="/login">
                                    <LogIn className="h-4 w-4" />
                                    <span className="sr-only">Войти</span>
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <nav className="flex md:hidden items-center gap-6 pb-4">
                    <Link
                        href="/translator"
                        className={`relative transition-colors hover:text-foreground/80 ${
                            isActive("/translator")
                                ? "text-foreground"
                                : "text-foreground/60"
                        }`}
                    >
                        Переводчик
                        {isActive("/translator") && (
                            <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#06b6d4]" />
                        )}
                    </Link>
                    <Link
                        href="/flashcards"
                        className={`relative transition-colors hover:text-foreground/80 ${
                            isActive("/cards") ||
                            pathname.startsWith("/module/")
                                ? "text-foreground"
                                : "text-foreground/60"
                        }`}
                    >
                        Карточки
                        {(isActive("/flashcards") ||
                            pathname.startsWith("/module/")) && (
                            <span className="absolute -bottom-4 left-0 right-0 h-0.5 bg-[#06b6d4]" />
                        )}
                    </Link>
                </nav>
            </div>
        </header>
    );
}
