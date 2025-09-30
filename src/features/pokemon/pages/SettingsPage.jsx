import { useState, useEffect } from 'preact/hooks';
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
} from '@mui/material';
import {
  Language,
  DarkMode,
  Storage,
  Delete,
  Info,
  Smartphone,
  Download,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout/index.js';
import { LanguageSelector } from '@/components/LanguageSelector.jsx';
import { useTranslation } from '@features/i18n/hooks/useTranslation.js';
import { useAppDispatch, useAppSelector } from '@features/shared/hooks/useAppDispatch.js';
import { toggleTheme } from '@features/shared/store/uiSlice.js';
import { clearCache, getCacheSize, isInstalled } from '@features/shared/utils/serviceWorker.js';

/**
 * Componente SettingsPage
 * Página de configurações da aplicação
 */
export const SettingsPage = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector(state => state.ui);
  
  const [cacheSize, setCacheSize] = useState(0);
  const [clearCacheDialogOpen, setClearCacheDialogOpen] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [appInstalled, setAppInstalled] = useState(false);

  useEffect(() => {
    // Verificar tamanho do cache
    loadCacheSize();
    
    // Verificar se app está instalado
    setAppInstalled(isInstalled());
  }, []);

  const loadCacheSize = async () => {
    try {
      const size = await getCacheSize();
      setCacheSize(size);
    } catch (error) {
      console.error('Error loading cache size:', error);
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
      
      // Mostrar feedback de sucesso
      console.log('Cache cleared successfully');
    } catch (error) {
      console.error('Error clearing cache:', error);
    } finally {
      setIsClearing(false);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isDarkMode = theme === 'dark';

  return (
    <MainLayout title={t('settings.title')}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t('settings.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Personalize sua experiência na aplicação
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
                primary={t('settings.theme.title')}
                secondary={t('settings.theme.description')}
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
                primary={t('settings.language.title')}
                secondary={t('settings.language.description')}
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
                primary={t('settings.cache.title')}
                secondary={
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      {t('settings.cache.description')}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {t('settings.cache.size', { size: formatBytes(cacheSize) })}
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
                  {t('settings.cache.clear')}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          </List>
        </Paper>

        {/* Seção de Informações do App */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info />
              Informações do App
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Status de instalação */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Status de Instalação</Typography>
                <Chip
                  icon={appInstalled ? <Smartphone /> : <Download />}
                  label={appInstalled ? 'Instalado' : 'Navegador'}
                  color={appInstalled ? 'success' : 'default'}
                  size="small"
                />
              </Box>
              
              {/* Versão */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2">Versão</Typography>
                <Typography variant="body2" color="text.secondary">v1.0.0</Typography>
              </Box>
              
              {/* Funcionalidades */}
              <Box>
                <Typography variant="body2" gutterBottom>Funcionalidades Disponíveis</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  <Chip label="PWA" size="small" />
                  <Chip label="Offline" size="small" />
                  <Chip label="Cache" size="small" />
                  <Chip label="Favoritos" size="small" />
                  <Chip label="Comparação" size="small" />
                  <Chip label="Multilíngue" size="small" />
                </Box>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Avisos */}
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="body2">
            As configurações são salvas automaticamente e sincronizadas entre dispositivos.
          </Typography>
        </Alert>

        {/* Dialog de confirmação para limpar cache */}
        <Dialog
          open={clearCacheDialogOpen}
          onClose={() => setClearCacheDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {t('settings.cache.clear')}
          </DialogTitle>
          <DialogContent>
            <Typography paragraph>
              {t('settings.cache.clearDescription')}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tamanho atual do cache: {formatBytes(cacheSize)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button 
              onClick={() => setClearCacheDialogOpen(false)}
              disabled={isClearing}
            >
              {t('actions.cancel')}
            </Button>
            <Button
              onClick={handleClearCache}
              color="error"
              variant="contained"
              disabled={isClearing}
              startIcon={isClearing ? null : <Delete />}
            >
              {isClearing ? t('app.loading') : t('actions.confirm')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};
