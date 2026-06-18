import { createContext, useContext } from "react";

export interface AuthUser {
    id?: number;
    name?: string;
    email?: string;
    profileType: 'admin' | 'professor' | 'student';
}

export interface AuthContextType {
    isLoggedIn: boolean;
    token: string | null;
    user: AuthUser | null;
    login: (token: string, user: AuthUser) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default useAuth;
