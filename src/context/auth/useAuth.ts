import type { UserProfileType } from "@/state/userSlice";
import { createContext, useContext } from "react";

export interface AuthUser {
    id: number | undefined;
    name: string | undefined;
    email: string | undefined;
    profileType: UserProfileType | undefined;
}

export interface AuthContextType {
    isLoggedIn: boolean;
    user: AuthUser | null;
    login: (user: AuthUser) => void;
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
