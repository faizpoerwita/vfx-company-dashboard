import { z } from 'zod';
import { toast } from 'react-hot-toast';

// Role definitions
export const UserRole = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  ARTIST: 'artist',
  CLIENT: 'client',
  GUEST: 'guest',
} as const;

export type Role = keyof typeof UserRole;

// Permission definitions
export const Permissions = {
  CREATE_PROJECT: 'create:project',
  EDIT_PROJECT: 'edit:project',
  DELETE_PROJECT: 'delete:project',
  VIEW_PROJECT: 'view:project',
  MANAGE_USERS: 'manage:users',
  MANAGE_ROLES: 'manage:roles',
} as const;

type Permission = typeof Permissions[keyof typeof Permissions];

// Role-Permission mapping
const rolePermissions: Record<Role, Permission[]> = {
  ADMIN: Object.values(Permissions),
  MANAGER: [
    Permissions.CREATE_PROJECT,
    Permissions.EDIT_PROJECT,
    Permissions.VIEW_PROJECT,
  ],
  ARTIST: [Permissions.VIEW_PROJECT],
  CLIENT: [Permissions.VIEW_PROJECT],
  GUEST: [],
};

// Security validation schemas
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const emailSchema = z
  .string()
  .email('Invalid email format')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must not exceed 255 characters');

const security = {
  // Token management
  getToken(): string | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      // Verify token hasn't expired
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (Date.now() >= payload.exp * 1000) {
        this.clearToken();
        return null;
      }
      
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      this.clearToken();
      return null;
    }
  },

  setToken(token: string): void {
    try {
      if (!token) {
        console.error('Attempted to set empty token');
        return;
      }
      localStorage.setItem('token', token);
    } catch (error) {
      console.error('Error setting token:', error);
      toast.error('Failed to save authentication token');
    }
  },

  clearToken(): void {
    try {
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  },

  // CSRF token management
  getCSRFToken(): string | null {
    return document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null;
  },

  // Permission checking
  hasPermission(userRole: Role, permission: Permission): boolean {
    return rolePermissions[userRole]?.includes(permission) || false;
  },

  // Password validation
  validatePassword(password: string): boolean {
    try {
      passwordSchema.parse(password);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      }
      return false;
    }
  },

  // Email validation
  validateEmail(email: string): boolean {
    try {
      emailSchema.parse(email);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          toast.error(err.message);
        });
      }
      return false;
    }
  },

  // XSS prevention
  sanitizeInput(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  },

  // Session management
  validateSession(): boolean {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }

      // Parse and validate token
      const parts = token.split('.');
      if (parts.length !== 3) {
        this.clearToken();
        return false;
      }

      const payload = JSON.parse(atob(parts[1]));
      
      // Check token expiration with 5-minute buffer
      const expirationBuffer = 5 * 60 * 1000; // 5 minutes in milliseconds
      if (Date.now() >= (payload.exp * 1000) - expirationBuffer) {
        this.clearToken();
        return false;
      }

      // Validate required claims
      if (!payload.userId || !payload.role) {
        this.clearToken();
        return false;
      }

      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      this.clearToken();
      return false;
    }
  },

  // Rate limiting helper
  createRateLimiter(limit: number, windowMs: number) {
    const requests = new Map<string, number[]>();

    return (key: string): boolean => {
      const now = Date.now();
      const windowStart = now - windowMs;

      // Get existing requests and filter out old ones
      const existingRequests = (requests.get(key) || []).filter(
        (timestamp) => timestamp > windowStart
      );

      // Check if limit is exceeded
      if (existingRequests.length >= limit) {
        return false;
      }

      // Add new request
      existingRequests.push(now);
      requests.set(key, existingRequests);
      return true;
    };
  },

  // Secure data encryption (for sensitive data in localStorage)
  encryptData(data: string): string {
    // Add encryption logic here if needed
    return btoa(data);
  },

  decryptData(encryptedData: string): string {
    // Add decryption logic here if needed
    return atob(encryptedData);
  },
};

export default security;
