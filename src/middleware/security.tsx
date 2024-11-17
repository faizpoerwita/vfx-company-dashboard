import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import security, { Permissions, Role } from '@/utils/security';
import { toast } from 'react-hot-toast';

interface SecureRouteProps {
  children: React.ReactNode;
  requiredPermission?: typeof Permissions[keyof typeof Permissions];
  requiredRoles?: Role[];
}

export const SecureRoute: React.FC<SecureRouteProps> = ({
  children,
  requiredPermission,
  requiredRoles,
}) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // Check if user is authenticated
  if (!isAuthenticated) {
    toast.error('Please sign in to access this page');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check if session is valid
  if (!security.validateSession()) {
    toast.error('Session expired. Please sign in again');
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRoles && user?.role) {
    if (!requiredRoles.includes(user.role as Role)) {
      toast.error('Access denied: Insufficient permissions');
      return <Navigate to="/" replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission && user?.role) {
    if (!security.hasPermission(user.role as Role, requiredPermission)) {
      toast.error('Access denied: Insufficient permissions');
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Rate limiting middleware
export const withRateLimit = (
  WrappedComponent: React.ComponentType,
  limit: number = 50,
  windowMs: number = 60000
) => {
  const rateLimiter = security.createRateLimiter(limit, windowMs);

  return function WithRateLimitComponent(props: any) {
    const checkRateLimit = () => {
      const userId = localStorage.getItem('userId') || 'anonymous';
      if (!rateLimiter(userId)) {
        toast.error('Rate limit exceeded. Please try again later.');
        return false;
      }
      return true;
    };

    return <WrappedComponent {...props} checkRateLimit={checkRateLimit} />;
  };
};

// CSRF protection middleware
export const withCsrfProtection = (WrappedComponent: React.ComponentType) => {
  return function WithCsrfProtectionComponent(props: any) {
    const csrfToken = security.getCsrfToken();

    React.useEffect(() => {
      if (!csrfToken) {
        console.error('CSRF token not found');
        toast.error('Security validation failed');
      }
    }, [csrfToken]);

    return <WrappedComponent {...props} csrfToken={csrfToken} />;
  };
};

// Input sanitization middleware
export const withInputSanitization = (WrappedComponent: React.ComponentType) => {
  return function WithInputSanitizationComponent(props: any) {
    const sanitizeProps = (inputProps: any): any => {
      if (typeof inputProps !== 'object') return inputProps;

      return Object.entries(inputProps).reduce((acc, [key, value]) => {
        if (typeof value === 'string') {
          acc[key] = security.sanitizeInput(value);
        } else if (typeof value === 'object' && value !== null) {
          acc[key] = sanitizeProps(value);
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);
    };

    const sanitizedProps = sanitizeProps(props);
    return <WrappedComponent {...sanitizedProps} />;
  };
};

// Combine all security middlewares
export const withSecurity = (Component: React.ComponentType) => {
  return withRateLimit(
    withCsrfProtection(
      withInputSanitization(Component)
    )
  );
};
