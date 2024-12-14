import { Suspense, lazy } from 'react';
import { 
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
  Navigate
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './components/error/ErrorBoundary';
import RouterErrorBoundary from './components/error/RouterErrorBoundary';
import LoadingSpinner from './components/ui/LoadingSpinner';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';

// Lazy load pages
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Projects = lazy(() => import('@/pages/Projects'));
const Tasks = lazy(() => import('@/pages/Tasks'));
const Team = lazy(() => import('@/pages/Team'));
const Resources = lazy(() => import('@/pages/Resources'));
const Analytics = lazy(() => import('@/pages/Analytics'));
const Settings = lazy(() => import('@/pages/Settings'));
const Admin = lazy(() => import('@/pages/Admin'));
const Signin = lazy(() => import('@/pages/Signin'));
const Signup = lazy(() => import('@/pages/Signup'));

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route errorElement={<RouterErrorBoundary />}>
      {/* Auth Routes */}
      <Route>
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes with Layout */}
      <Route element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/team" element={<Team />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Route>
  )
);

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Suspense fallback={<LoadingSpinner />}>
          <RouterProvider router={router} />
        </Suspense>
        <Toaster 
          position="top-right" 
          toastOptions={{
            duration: 3000,
            style: {
              background: '#18181b',
              color: '#fff',
              borderRadius: '0.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            },
          }}
        />
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;
