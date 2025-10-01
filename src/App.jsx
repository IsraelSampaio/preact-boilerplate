import { Router } from "preact-router";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";
import { store } from "@/store/index.js";
import { lightTheme, darkTheme } from "@/theme/theme.js";
import { useTheme } from "@/features/shared/hooks/index.js";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt.jsx";
import {
  HomePage,
  PokemonListPage,
  PokemonDetailsPage,
  FavoritesPage,
  ComparisonPage,
  SettingsPage,
} from "@/features/pokemon/index.js";

const AppContent = () => {
  const { theme } = useTheme();
  const currentTheme = theme === "dark" ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <PWAInstallPrompt />
      <Router>
        <HomePage path="/" />
        <PokemonListPage path="/pokemon" />
        <PokemonDetailsPage path="/pokemon/:id" />
        <FavoritesPage path="/favorites" />
        <ComparisonPage path="/comparison" />
        <SettingsPage path="/settings" />
        <div path="/about">Sobre - Em desenvolvimento</div>
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
