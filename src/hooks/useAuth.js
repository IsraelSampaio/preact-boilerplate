import { useCallback } from 'preact/hooks';
import { useAppDispatch, useAppSelector } from './useAppDispatch.js';
import { loginStart, loginSuccess, loginFailure, logout } from '@/store/slices/authSlice.js';

/**
 * @typedef {import('../types/index.js').User} User
 */

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth);

  /**
   * @param {string} email 
   * @param {string} password 
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const login = useCallback(async (email, password) => {
    dispatch(loginStart());
    
    try {
      // Login simulation - in real application, you would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (email === 'admin@pokemon.com' && password === 'admin123') {
        const user = {
          id: '1',
          email,
          name: 'Administrator',
        };
        dispatch(loginSuccess(user));
        return { success: true };
      } else {
        dispatch(loginFailure('Invalid credentials'));
        return { success: false, error: 'Invalid credentials' };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error making login';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  }, [dispatch]);

  const handleLogout = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout: handleLogout,
  };
};
