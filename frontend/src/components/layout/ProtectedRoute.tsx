import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/auth.types';
import { Skeleton } from '../common/Skeleton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 space-y-4">
        <div className="w-12 h-12 border-4 border-gov-blue border-t-saffron-600 rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-600">Verifying citizen session...</p>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    const intendedPath = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?returnTo=${encodeURIComponent(intendedPath)}`} state={{ from: intendedPath }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but lacks role authorization
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
