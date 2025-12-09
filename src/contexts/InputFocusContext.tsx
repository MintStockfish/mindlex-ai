import { createContext, useContext, ReactNode, useRef } from "react";

interface InputFocusContextType {
    inputRef: React.RefObject<HTMLInputElement | null>;
    setQuery: (value: string) => void;
}

const InputFocusContext = createContext<InputFocusContextType | undefined>(
    undefined
);

export function InputFocusProvider({
    children,
    setQuery,
}: {
    children: ReactNode;
    setQuery?: (value: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <InputFocusContext.Provider
            value={{
                inputRef,
                setQuery: setQuery || (() => {}),
            }}
        >
            {children}
        </InputFocusContext.Provider>
    );
}

export function useInputFocus() {
    const context = useContext(InputFocusContext);
    if (context === undefined) {
        throw new Error(
            "useInputFocus must be used within an InputFocusProvider"
        );
    }
    return context;
}
