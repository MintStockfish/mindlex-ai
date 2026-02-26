import { act, renderHook } from "@testing-library/react";

import { setupLocalStorage } from "@/__tests__/render-with-providers";

import { ModulesProvider, useModulesContext } from "./ModulesContext";

jest.mock("sonner", () => ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
    },
}));

describe("useModulesContext", () => {
    beforeEach(() => {
        setupLocalStorage();
        jest.clearAllMocks();
    });

    test("should initialize context with correct data", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        const context = result.current;

        expect(context.modules.length).toEqual(0);
        expect(context.isLoading).toBeFalsy();
    });

    test("should add module", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        const newModule = {
            title: "test title",
            description: "test description",
        };

        act(() => {
            result.current.createModule(newModule);
        });

        expect(
            result.current.modules.find((m) => m.title === "test title"),
        ).toMatchObject(newModule);
    });

    test("should return null when title has not given", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        const newModule = {
            title: "",
            description: "test description",
        };

        act(() => {
            result.current.createModule(newModule);
        });

        expect(result.current.modules).toHaveLength(0);
    });

    test("should load modules from localStorage on init", () => {
        const savedData = [
            { id: "99", title: "Saved Module", words: [], wordCount: 0 },
        ];
        window.localStorage.setItem("modules", JSON.stringify(savedData));

        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        expect(result.current.modules).toHaveLength(1);
        expect(result.current.modules[0].title).toBe("Saved Module");
    });

    test("should give correct id to it when module added", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        act(() => {
            result.current.createModule({ title: "Module 1" });
            result.current.createModule({ title: "Module 2" });
        });

        const modules = result.current.modules;
        expect(modules[0].id).toBe("1");
        expect(modules[1].id).toBe("2");
    });

    test("should add card", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        const newModule = {
            title: "test title",
            description: "test description",
        };

        const newCard = {
            name: "test card",
            translation: "тест карта",
            ipa: "тэст кард",
        };

        act(() => {
            const id = result.current.createModule(newModule);
            result.current.addCard(id!, newCard);
        });

        const foundModule = result.current.modules.find(
            (m) => m.title === "test title",
        )!;

        expect(
            foundModule.words.find((cards) => cards.name === "test card"),
        ).toMatchObject(newCard);
    });

    test("should not add card if name is has not given", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        const newModule = {
            title: "test title",
            description: "test description",
        };

        const newCard = {
            name: "",
            translation: "тест карта",
            ipa: "тэст кард",
        };

        act(() => {
            const id = result.current.createModule(newModule);
            result.current.addCard(id!, newCard);
        });

        const foundModule = result.current.modules.find(
            (m) => m.title === "test title",
        )!;

        expect(foundModule.words).toHaveLength(0);
    });

    test("should delete card", () => {
        const { result } = renderHook(useModulesContext, {
            wrapper: ModulesProvider,
        });

        const newModule = {
            title: "test title",
            description: "test description",
        };

        const newCard = {
            name: "test card",
            translation: "тест карта",
            ipa: "тэст кард",
        };

        let moduleId: string;
        act(() => {
            moduleId = result.current.createModule(newModule)!;
        });

        act(() => {
            result.current.addCard(moduleId!, newCard);
        });

        const createdCard = result.current.modules.find(
            (m) => m.id === moduleId,
        )!.words[0];

        act(() => {
            result.current.deleteCard(moduleId!, createdCard.id!);
        });

        const moduleAfterDelete = result.current.modules.find(
            (m) => m.id === moduleId,
        );
        expect(moduleAfterDelete!.words).toHaveLength(0);
    });
});
