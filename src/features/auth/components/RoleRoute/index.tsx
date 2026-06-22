import { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth/useAuth';
import type { UserProfileType } from '@/state/userSlice';

interface RoleRouteProps {
    children: ReactNode;
    allowedRoles: UserProfileType[];
}

export const RoleRoute = ({ children, allowedRoles }: RoleRouteProps) => {
    const { user, isCheckingSession } = useAuth();
    if (isCheckingSession) return null;
    if (!user?.profileType || !allowedRoles.includes(user.profileType)) {
        return <Navigate to="/" replace />;
    }
    return <>{children}</>;
};
