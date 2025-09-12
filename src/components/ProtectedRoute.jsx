import { useEffect } from 'preact/hooks';
import { useAuth } from '@/hooks/useAuth.js';
import { LoginForm } from '@/features/auth/index.js';

/**
 * Component to protect routes that require authentication
 * @param {Object} props
 * @param {import('preact').ComponentChildren} props.children - Child components to be rendered
 */
export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Here you could add additional authentication verification logic
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  return <>{children}</>;
};
