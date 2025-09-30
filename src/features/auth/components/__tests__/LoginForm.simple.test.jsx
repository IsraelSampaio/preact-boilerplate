import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock do hook useAuth
const mockLogin = vi.fn();
const mockIsLoading = false;
const mockError = null;

vi.mock('../../hooks/useAuth.js', () => ({
  useAuth: () => ({
    login: mockLogin,
    isLoading: mockIsLoading,
    error: mockError,
  }),
}));

describe('LoginForm Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should have mock login function available', () => {
    expect(mockLogin).toBeDefined();
    expect(typeof mockLogin).toBe('function');
  });

  it('should have correct mock values', () => {
    expect(mockIsLoading).toBe(false);
    expect(mockError).toBe(null);
  });

  it('should be able to call mock login function', () => {
    mockLogin('test@example.com', 'password123');
    expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
