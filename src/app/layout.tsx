import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/Toaster";
import { AuthProvider } from "../contexts/AuthContext";
import { ThemeScript } from "@/components/ThemeScript";

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
                    <ThemeProvider>
                        <Header />
                        <main className="flex-1">{children}</main>
                        <Footer />
                        <Toaster />
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
