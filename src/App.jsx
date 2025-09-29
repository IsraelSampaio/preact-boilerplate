import { Router } from 'preact-router';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from '@/store/index.js';
import { ProtectedRoute } from '@/components/ProtectedRoute.jsx';
import { lightTheme, darkTheme } from '@/theme/theme.js';
import { useAppSelector } from '@/features/shared/hooks/useAppDispatch.js';
import { PWAInstallPrompt } from '@/components/PWAInstallPrompt.jsx';
import { HomePage, PokemonListPage, PokemonDetailsPage, FavoritesPage, ComparisonPage, SettingsPage } from '@/features/pokemon/index.js';

const AppContent = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <PWAInstallPrompt />
      <Router>
        <ProtectedRoute path="/">
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path="/pokemon">
          <PokemonListPage />
        </ProtectedRoute>
        <ProtectedRoute path="/pokemon/:id">
          <PokemonDetailsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/favorites">
          <FavoritesPage />
        </ProtectedRoute>
        <ProtectedRoute path="/comparison">
          <ComparisonPage />
        </ProtectedRoute>
        <ProtectedRoute path="/settings">
          <SettingsPage />
        </ProtectedRoute>
        <ProtectedRoute path="/about">
          <div>Sobre - Em desenvolvimento</div>
        </ProtectedRoute>
      </Router>
    </ThemeProvider>
  );
};

export const App = () => {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
};
