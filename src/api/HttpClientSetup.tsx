import { useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { httpClientHandlers } from './httpClientHandlers';
import { selectIsAuthenticated, userLogout } from '@/state/userSlice';
import type { AppDispatch } from '@/state/store';

interface HttpClientSetupProps {
    children: ReactNode;
}

export function HttpClientSetup({ children }: HttpClientSetupProps) {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector(selectIsAuthenticated);

    // Ref avoids stale closure in the registered callbacks
    const isAuthenticatedRef = useRef(isAuthenticated);
    useEffect(() => {
        isAuthenticatedRef.current = isAuthenticated;
    }, [isAuthenticated]);

    useEffect(() => {
        httpClientHandlers.onUnauthorized = () => {
            // Only redirect if the user was actually logged in; this prevents
            // the session-check me() call from triggering a redirect on first load.
            if (!isAuthenticatedRef.current) return;
            dispatch(userLogout());
            navigate('/login');
        };

        httpClientHandlers.onForbidden = () => {
            navigate(-1);
        };

        return () => {
            httpClientHandlers.onUnauthorized = null;
            httpClientHandlers.onForbidden = null;
        };
    }, [dispatch, navigate]);

    return <>{children}</>;
}
