import { type ReactNode, useState } from "react";
import { AuthContext, type AuthUser } from "./useAuth";
import { TOKEN_KEY_STORAGE } from "@/api/httpClient";

interface AuthProviderProps {
    children: ReactNode;
}

const USER_KEY = 'projecta_user';

function loadUser(): AuthUser | null {
    try {
        const raw = localStorage.getItem(USER_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [token, setToken] = useState<string | null>(
        () => localStorage.getItem(TOKEN_KEY_STORAGE)
    );
    const [user, setUser] = useState<AuthUser | null>(loadUser);

    const login = (newToken: string, newUser: AuthUser) => {
        localStorage.setItem(TOKEN_KEY_STORAGE, newToken);
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        setToken(newToken);
        setUser(newUser);
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY_STORAGE);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!token, token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
