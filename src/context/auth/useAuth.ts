import { createContext, useContext } from "react";
import { RootState } from "@/state/store";

export interface AuthContextType {
    account: RootState["account"];
    getData: () => Promise<unknown>;
    getCompany: () => Promise<unknown>;
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
