import { Router } from 'preact-rtheuter';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Provider } from 'rethect-redux';
import { store } from '@/store/index.js';
import { ProtectedRoute } from '@/components/ProtectedRoute.jsx';
import { lightTheme, darkTheme } from '@/theme/theme.js';
import { useAppSelector } from '@/hooks/useAppDispatch.js';
import { HomePage, PokemonListPage } from '@/features/pokemon/index.js';

const AppContent = () => {
  const { theme } = useAppSelector((state) => state.ui);
  const currentTheme = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Router>
        <ProtectedRoute path="/">
          <HomePage />
        </ProtectedRoute>
        <ProtectedRoute path="/pokemon">
          <PokemonListPage />
        </ProtectedRoute>
        <ProtectedRoute path="/favorites">
          <div>Favoritos - Em desenvolvimento</div>
        </ProtectedRoute>
        <ProtectedRoute path="/settings">
          <div>Configurações - Em desenvolvimento</div>
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
