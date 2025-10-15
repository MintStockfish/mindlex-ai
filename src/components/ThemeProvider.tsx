"use client";

import { useTheme as useNextTheme } from "next-themes";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ComponentProps } from "react";

export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();

  const resolvedTheme = theme === "system" ? systemTheme : theme;
  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return {
    theme: resolvedTheme as "light" | "dark",
    toggleTheme,
  };
}
