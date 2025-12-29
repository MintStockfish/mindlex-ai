"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

interface User {
    id: string;
    email: string;
    name: string;
    password?: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    register: (
        email: string,
        password: string,
        name: string
    ) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("mindlex_user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (_e) {
                console.log(_e);
                localStorage.removeItem("mindlex_user");
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const users = JSON.parse(localStorage.getItem("mindlex_users") || "[]");
        const foundUser: User = users.find(
            (u: User) => u.email === email && u.password === password
        );

        if (foundUser) {
            const userData: User = {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
            };
            setUser(userData);
            localStorage.setItem("mindlex_user", JSON.stringify(userData));
            return true;
        }

        return false;
    };

    const register = async (
        name: string,
        email: string,
        password: string
    ): Promise<boolean> => {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const users: User[] = JSON.parse(
            localStorage.getItem("mindlex_users") || "[]"
        );
        const existingUser = users.find((u: User) => u.email === email);

        if (existingUser) {
            return false;
        }

        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
        };

        users.push(newUser);
        localStorage.setItem("mindlex_users", JSON.stringify(users));

        const userData: User = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
        };
        setUser(userData);
        localStorage.setItem("mindlex_user", JSON.stringify(userData));

        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("mindlex_user");
    };

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, isLoading }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
