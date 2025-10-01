import { useAuth } from "@features/auth/hooks/useAuth.js";

export const ProtectedRoute = ({ children, _path }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h2>Acesso Restrito</h2>
        <p>Você precisa fazer login para acessar esta página.</p>
      </div>
    );
  }

  return children;
};
