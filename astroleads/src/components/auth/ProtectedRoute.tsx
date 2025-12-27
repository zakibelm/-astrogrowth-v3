import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireRole?: 'admin' | 'user';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAuth = true,
    requireRole,
}) => {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    // If auth is required but user is not authenticated
    if (requireAuth && !isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If specific role is required but user doesn't have it
    if (requireRole && user?.role !== requireRole) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};
