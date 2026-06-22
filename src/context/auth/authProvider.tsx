import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./useAuth";
import type { AppDispatch, RootState } from "@/state/store";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, userLogout, userMe } from "@/state/userSlice";
import { authServices } from "@/api/auth/implementation/authServices";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const user = useSelector((state: RootState) => state.user)
    const dispatch = useDispatch<AppDispatch>()
    const [isCheckingSession, setIsCheckingSession] = useState(true)

    const login = (newUser: AuthUser) => {
        dispatch(userLogin(newUser))
    };

    const logout = async () => {
        try{
            await authServices.logout()
            dispatch(userLogout())
        }catch(ex){
            console.log(ex)
        }
    };

    useEffect(() => {
        if (user.isAuthenticated) {
            setIsCheckingSession(false)
            return
        }
        const retrieveUserData = async () => {
            try {
                const result = await authServices.me()
                if (result.type === "success" && result.data)
                    dispatch(userMe(result.data))
            }
            catch (ex) {
                console.log(ex)
            } finally {
                setIsCheckingSession(false)
            }
        }
        retrieveUserData()
    }, [dispatch, user.isAuthenticated])

    return (
        <AuthContext.Provider value={{ isLoggedIn: user.isAuthenticated, isCheckingSession, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
