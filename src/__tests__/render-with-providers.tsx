import { render, RenderOptions } from "@testing-library/react";
import { ReactElement, ReactNode } from "react";
import { ModulesProvider } from "@/features/flashcards/contexts/ModulesContext";
import { InputFocusProvider } from "@/features/translator/contexts/context";
import { JSX } from "react";

export const setupLocalStorage = (): void => {
    const localStorageMock: Storage = {
        getItem: jest.fn<string | null, [string]>(() => "[]"),
        setItem: jest.fn<void, [string, string]>(),
        removeItem: jest.fn<void, [string]>(),
        clear: jest.fn<void, []>(),
        length: 0,
        key: jest.fn<string | null, [number]>(() => null),
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
