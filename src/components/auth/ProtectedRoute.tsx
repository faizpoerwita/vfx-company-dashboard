import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to signin if not authenticated
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (user && !user.onboardingCompleted && location.pathname !== '/onboarding') {
    // Redirect to onboarding if authenticated but onboarding not completed
    return <Navigate to="/onboarding" replace />;
  }

  if (user?.onboardingCompleted && location.pathname === '/onboarding') {
    // Redirect to dashboard if onboarding is already completed
    return <Navigate to="/dashboard" replace />;
  }

  // Check role requirements
  if (requiredRole && user && !requiredRole.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
