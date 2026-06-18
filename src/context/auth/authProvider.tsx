import { useEffect, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./useAuth";
import type { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, userLogout } from "@/state/userSlice";
import { authServices } from "@/api/auth/implementation/authServices";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    const login = (newUser: AuthUser) => {
        dispatch(userLogin(newUser))
    };

    const logout = () => {
        dispatch(userLogout())
    };

    useEffect(() => {
        const retrieveUserData = async () => {
            try {
                const result = await authServices.me()

                if (result.type === "success" && result.data)
                    dispatch(userLogin(result.data))
            }
            catch (ex) {
                console.log(ex)
            }
        }
        if (!user.isAuthenticated)
            retrieveUserData()
        return () => { }
    }, [dispatch, user.isAuthenticated])

    return (
        <AuthContext.Provider value={{ isLoggedIn: user.isAuthenticated, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
