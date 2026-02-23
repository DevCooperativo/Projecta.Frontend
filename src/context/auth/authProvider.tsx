import { ReactNode, useCallback, useEffect } from "react";
import { AuthContext } from "./useAuth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/state/store";
import { getData, getCompany } from "@/state/account/accountSlice";

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const dispatch = useDispatch<AppDispatch>();
    const account = useSelector((state: RootState) => state.account);

    const getDataFn = useCallback(async () => {
        return await dispatch(getData()).unwrap();
    }, [dispatch]);

    const getCompanyFn = useCallback(async () => {
        return await dispatch(getCompany()).unwrap();
    }, [dispatch]);
    useEffect(() => {
        const getInformation = async () => {
            await getDataFn()
        }
        getInformation()
    }, [getDataFn])

    useEffect(() => {
        const loadCompanyData = async () => {
            if (account.accessState !== "authenticated")
                return
            if (account.role !== "company")
                return
            if (account.registrationState !== "non_initialized")
                return
            await getCompanyFn()
        }
        loadCompanyData()
    }, [account.accessState, account.registrationState, account.role, getCompanyFn])
    return (
        <AuthContext.Provider
            value={{
                account,
                getData: getDataFn,
                getCompany: getCompanyFn,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;
