import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { ThemeScript } from "@/components/shared/ThemeScript";
import { Toaster } from "@/components/shared/Toaster";
import { AuthProvider } from "@/features/auth/contexts/context";
import { ModulesProvider } from "@/features/flashcards/contexts/ModulesContext";
import { HistoryProvider } from "@/features/translator/contexts/ContextHistory";

import "../styles/globals.css";

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
                        <HistoryProvider>
                            <ThemeProvider>
                                <Header />
                                <main className="flex-1">{children}</main>
                                <Footer />
                                <Toaster />
                            </ThemeProvider>
                        </HistoryProvider>
                    </ModulesProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
