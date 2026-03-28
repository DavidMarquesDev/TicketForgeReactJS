import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../modules/auth/presentation/context/use-auth';
import type { UserRole } from '../../modules/auth/domain/auth.types';

type ProtectedRouteProps = {
    roles?: UserRole[];
};

export const ProtectedRoute = ({ roles }: ProtectedRouteProps) => {
    const location = useLocation();
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return <div className="app-shell">Carregando sessão...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;
    }

    if (roles && user && !roles.includes(user.role)) {
        return <Navigate to="/tickets" replace />;
    }

    return <Outlet />;
};
