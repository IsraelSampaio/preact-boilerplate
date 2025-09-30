import { useAuth } from '@features/auth/hooks/useAuth.js';

/**
 * Component ProtectedRoute
 * Protege rotas que requerem autenticação
 */
export const ProtectedRoute = ({ children, _path }) => {
  const { isAuthenticated } = useAuth();

  // Por enquanto, assume que sempre está autenticado para desenvolvimento
  // Em produção, verificaria a autenticação real
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Acesso Restrito</h2>
        <p>Você precisa fazer login para acessar esta página.</p>
      </div>
    );
  }

  return children;
};