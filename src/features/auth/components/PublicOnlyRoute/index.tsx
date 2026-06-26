import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';

interface PublicOnlyRouteProps {
    children: ReactNode;
}

export const PublicOnlyRoute = ({ children }: PublicOnlyRouteProps) => {
    const { isLoggedIn, isCheckingSession } = useAuth();
    if (isCheckingSession) return null;
    return !isLoggedIn ? <>{children}</> : <Navigate to="/" replace />;
};
