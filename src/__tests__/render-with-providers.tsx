import { ReactElement, ReactNode } from "react";
import { JSX } from "react";
import { render, RenderOptions } from "@testing-library/react";

import { ModulesProvider } from "@/features/flashcards/contexts/ModulesContext";
import { InputFocusProvider } from "@/features/translator/contexts/InputContext";

export const setupLocalStorage = (): void => {
    let store: Record<string, string> = {};

    const localStorageMock = {
        getItem: jest.fn((key: string) => store[key] || null),
        setItem: jest.fn((key: string, value: string) => {
            store[key] = value.toString();
        }),
        removeItem: jest.fn((key: string) => {
            delete store[key];
        }),
        clear: jest.fn(() => {
            store = {};
        }),
        length: 0,
        key: jest.fn(),
    };

    Object.defineProperty(global, "localStorage", {
        value: localStorageMock,
        writable: true,
    });
};

interface AllProvidersProps {
    children: ReactNode;
}

function AllProviders({ children }: AllProvidersProps): JSX.Element {
    return (
        <InputFocusProvider>
            <ModulesProvider>{children}</ModulesProvider>
        </InputFocusProvider>
    );
}

export const renderWithProviders = (
    ui: ReactElement,
    options?: Omit<RenderOptions, "wrapper">,
) => {
    setupLocalStorage();
    return render(ui, { wrapper: AllProviders, ...options });
};

export * from "@testing-library/react";
