import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../LoginForm.jsx';

// Mock of the hook useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isLoading,
    error,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Pokémon App')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show test credentials', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Credenciais de teste')).toBeInTheDocument();
    expect(screen.getByText('Email: admin@pokemon.com')).toBeInTheDocument();
    expect(screen.getByText('Senha')).toBeInTheDocument();
  });

  it('should allow toggling password visibility', () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText('Senha');
    const toggleButton = screen.getByLabelText('toggle password visibility');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should disable button when fields are empty', () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable button when fields are filled', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(submitButton).not.toBeDisabled();
  });

  it('thefve permitir submissãthe thef the paramulárithe with Enter', async () => {
    const mockLogin = vi.fn();
    vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
      login,
      isLoading,
      error,
    });

    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('iin theil');
    const passwordInput = screen.getByLabelText('Senhthe');
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    fireEvent.keyPress(passwordInput, { key, code: 'Enter' });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });
});
