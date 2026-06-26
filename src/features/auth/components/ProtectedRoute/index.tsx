import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';

interface ProtectedRouteProps {
    children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isLoggedIn, isCheckingSession } = useAuth();
    if (isCheckingSession) return null;
    return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};
