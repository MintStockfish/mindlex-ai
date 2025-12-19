import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toaster } from "@/components/shared/Toaster";
import { AuthProvider } from "@/features/auth/context";
import { ThemeScript } from "@/components/shared/ThemeScript";

import { ModulesProvider } from "@/features/flashcards/contexts/ModulesContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Mindlex AI",
    description: "Mindlex AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeScript />
            </head>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <AuthProvider>
                    <ModulesProvider>
                        <ThemeProvider>
                            <Header />
                            <main className="flex-1">{children}</main>
                            <Footer />
                            <Toaster />
                        </ThemeProvider>
                    </ModulesProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
