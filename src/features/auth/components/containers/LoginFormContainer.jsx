import { useState } from 'preact/hooks';
import { useAuth } from '../../hooks/useAuth.js';
import { LoginFormPresentation } from '../presentations/LoginFormPresentation.jsx';

/**
 * Componente container do formulário de login (lógica de negócio)
 */
export const LoginFormContainer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    await login(email, password);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <LoginFormPresentation
      email={email}
      password={password}
      showPassword={showPassword}
      isLoading={isLoading}
      error={error}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onTogglePasswordVisibility={togglePasswordVisibility}
      onSubmit={handleSubmit}
    />
  );
};
