import { useEffect } from "preact/hooks";
import { useAppDispatch, useAppSelector } from "./useAppDispatch.js";
import { setTheme } from "../store/uiSlice.js";

const THEME_STORAGE_KEY = "pokemon-app-theme";

/**
 * Hook para gerenciar o tema da aplicação
 * Inclui persistência no localStorage e detecção de preferência do sistema
 */
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.ui);

  useEffect(() => {
    const loadTheme = () => {
      try {

        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && (savedTheme === "light" || savedTheme === "dark")) {
          dispatch(setTheme(savedTheme));
          return;
        }


        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)",).matches;
        const systemTheme = prefersDark ? "dark" : "light";

        dispatch(setTheme(systemTheme));
        localStorage.setItem(THEME_STORAGE_KEY, systemTheme);
      } catch (error) {
        console.error("Erro ao carregar tema:", error);

        dispatch(setTheme("light"));
      }
    };

    loadTheme();
  }, [dispatch]);


  useEffect(() => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (error) {
      console.error("Erro ao salvar tema:", error);
    }
  }, [theme]);


  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {

      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (!savedTheme) {
        const systemTheme = e.matches ? "dark" : "light";
        dispatch(setTheme(systemTheme));
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [dispatch]);

  return {
    theme,
    isDark: theme === "dark",
    isLight: theme === "light"
  };
};
