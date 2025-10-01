import { useState } from "preact/hooks";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import {
  Menu as MenuIcon,
  Brightness4,
  Brightness7,
} from "@mui/icons-material";
import { useAppDispatch, useTheme } from "@/features/shared/hooks/index.js";
import { toggleTheme } from "@/features/shared/store/uiSlice.js";
import { LanguageSelector } from "../LanguageSelector.jsx";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";

/**
 * Component Header
 * Cabeçalho principal da aplicação
 */
export const Header = ({ title }) => {
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleMenuToggle = () => {
    // dispatch(toggleSidebar());
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="toggle menu"
          onClick={handleMenuToggle}
          edge="start"
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {title || t("app.name")}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <LanguageSelector variant="menu" size="small" />

          <IconButton
            color="inherit"
            onClick={handleThemeToggle}
            aria-label="toggle theme"
          >
            {isDark ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
