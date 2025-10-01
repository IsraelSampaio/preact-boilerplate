import { useState, useEffect } from "preact/hooks";
import {
  Container,
  Typography,
  Box,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Switch,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from "@mui/material";
import {
  Language,
  DarkMode,
  Storage,
  Delete,
  Info,
  Smartphone,
  Download,
} from "@mui/icons-material";
import { MainLayout } from "@/components/layout/index.js";
import { LanguageSelector } from "@/components/LanguageSelector.jsx";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";
import { useAppDispatch, useTheme } from "@features/shared/hooks/index.js";
import { toggleTheme } from "@features/shared/store/uiSlice.js";
import {
  clearCache,
  getCacheSize,
  isInstalled,
} from "@features/shared/utils/serviceWorker.js";

/**
 * Componente SettingsPage
 * Página de configurações da aplicação
 */
export const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { isDark } = useTheme();

  const [cacheSize, setCacheSize] = useState(0);
  const [clearCacheDialogOpen, setClearCacheDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);

  useEffect(() => {
    loadCacheSize();
    setAppInstalled(isInstalled());
  }, []);

  const loadCacheSize = async () => {
    try {
      const size = await getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error("Error loading cache size:", error);
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleClearCache = async () => {
    setIsClearing(true);

    try {
      await clearCache();
      await loadCacheSize();
      setClearCacheDialogOpen(false);
      console.log("Cache cleared successfully");
    } catch (error) {
      console.error("Error clearing cache:", error);
    } finally {
      setIsClearing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isDarkMode = isDark;

  return (
    <MainLayout title={t("settings.title")}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("settings.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("settings.description")}
          </Typography>
        </Box>

        {/* Seção de Aparência */}
        <Paper sx={{ mb: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <DarkMode />
              </ListItemIcon>
              <ListItemText
                primary={t("settings.theme.title")}
                secondary={t("settings.theme.description")}
              />
              <ListItemSecondaryAction>
                <Switch
                  checked={isDarkMode}
                  onChange={handleThemeToggle}
                  color="primary"
                />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Seção de Idioma */}
        <Paper sx={{ mb: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <Language />
              </ListItemIcon>
              <ListItemText
                primary={t("settings.language.title")}
                secondary={t("settings.language.description")}
              />
              <ListItemSecondaryAction>
                <LanguageSelector variant="menu" />
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Seção de Cache */}
        <Paper sx={{ mb: 3 }}>
          <List>
            <ListItem>
              <ListItemIcon>
                <Storage />
              </ListItemIcon>
              <ListItemText
                primary={t("settings.cache.title")}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t("settings.cache.description")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t("settings.cache.size", {
                        size: formatBytes(cacheSize),
                      })}
                    </Typography>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Delete />}
                  onClick={() => setClearCacheDialogOpen(true)}
                  disabled={cacheSize === 0}
                >
                  {t("settings.cache.clear")}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Seção de Informações do App */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              <Info />
              {t("settings.appInfo.title")}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Status de instalação */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  {t("settings.appInfo.installationStatus")}
                </Typography>
                <Chip
                  icon={appInstalled ? <Smartphone /> : <Download />}
                  label={
                    appInstalled
                      ? t("settings.appInfo.installed")
                      : t("settings.appInfo.browser")
                  }
                  color={appInstalled ? "success" : "default"}
                  size="small"
                />
              </Box>

              {/* Versão */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography variant="body2">
                  {t("settings.appInfo.version")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  v1.0.0
                </Typography>
              </Box>

              {/* Funcionalidades */}
              <Box>
                <Typography variant="body2" gutterBottom>
                  {t("settings.appInfo.features")}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  <Chip label="PWA" size="small" />
                  <Chip label="Offline" size="small" />
                  <Chip label={t("settings.cache.title")} size="small" />
                  <Chip label={t("navigation.favorites")} size="small" />
                  <Chip label={t("navigation.comparison")} size="small" />
                  <Chip label={t("settings.language.title")} size="small" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Avisos */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">{t("settings.autoSave")}</Typography>
        </Alert>

        {/* Dialog de confirmação para limpar cache */}
        <Dialog
          open={clearCacheDialogOpen}
          onClose={() => setClearCacheDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>{t("settings.cache.clear")}</DialogTitle>
          <DialogContent>
            <Typography paragraph>
              {t("settings.cache.clearDescription")}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("settings.cache.currentSize", {
                size: formatBytes(cacheSize),
              })}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setClearCacheDialogOpen(false)}
              disabled={isClearing}
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={handleClearCache}
              color="error"
              variant="contained"
              disabled={isClearing}
              startIcon={isClearing ? null : <Delete />}
            >
              {isClearing ? t("app.loading") : t("actions.confirm")}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};
