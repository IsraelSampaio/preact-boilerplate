import { useState, useEffect } from 'preact/hooks';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  GetApp,
  Close,
  Smartphone,
  Desktop,
  Offline,
} from '@mui/icons-material';
import { showInstallPrompt, isInstalled, isOffline } from '@/utils/serviceWorker.js';

/**
 * Componente PWAInstallPrompt
 * Gerencia o prompt de instalação do PWA
 */
export const PWAInstallPrompt = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showFab, setShowFab] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  useEffect(() => {
    // Verificar se já está instalado
    setIsAppInstalled(isInstalled());

    // Listener para evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      console.log('Evento de instalação detectado');
      e.preventDefault();
      setInstallPromptEvent(e);
      
      // Mostrar FAB após um delay se não estiver instalado
      if (!isInstalled()) {
        setTimeout(() => setShowFab(true), 5000);
      }
    };

    // Listener para instalação bem-sucedida
    const handleAppInstalled = () => {
      console.log('PWA foi instalado');
      setIsAppInstalled(true);
      setShowFab(false);
      setShowDialog(false);
      setInstallPromptEvent(null);
    };

    // Listener para mudanças de conectividade
    const handleOffline = () => setShowOfflineAlert(true);
    const handleOnline = () => setShowOfflineAlert(false);

    // Adicionar listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    // Verificar conectividade inicial
    if (isOffline()) {
      setShowOfflineAlert(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPromptEvent) {
      return;
    }

    const installed = await showInstallPrompt(installPromptEvent);
    if (installed) {
      setShowFab(false);
      setShowDialog(false);
      setInstallPromptEvent(null);
    }
  };

  const handleShowDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleDismissOffline = () => {
    setShowOfflineAlert(false);
  };

  // Não mostrar nada se já estiver instalado
  if (isAppInstalled) {
    return (
      <Snackbar
        open={showOfflineAlert}
        onClose={handleDismissOffline}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleDismissOffline} 
          severity="warning" 
          icon={<Offline />}
        >
          Você está offline. Funcionalidade limitada disponível.
        </Alert>
      </Snackbar>
    );
  }

  return (
    <>
      {/* FAB de instalação */}
      {showFab && installPromptEvent && (
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
          }}
          onClick={handleShowDialog}
        >
          <GetApp />
        </Fab>
      )}

      {/* Dialog de instalação */}
      <Dialog
        open={showDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">
              Instalar Pokémon App
            </Typography>
            <IconButton onClick={handleCloseDialog}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <img 
                src="/icons/icon-96x96.png" 
                alt="Pokémon App" 
                style={{ width: 96, height: 96 }}
              />
            </Box>
            <Typography variant="h6" gutterBottom>
              Pokémon App - Pokédex Completa
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Instale nossa aplicação para uma experiência ainda melhor!
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              Benefícios da instalação:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Smartphone fontSize="small" color="primary" />
                <Typography variant="body2">
                  Acesso rápido direto da tela inicial
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Desktop fontSize="small" color="primary" />
                <Typography variant="body2">
                  Experiência nativa, sem navegador
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Offline fontSize="small" color="primary" />
                <Typography variant="body2">
                  Funciona mesmo sem internet
                </Typography>
              </Box>
            </Box>
          </Box>

          <Typography variant="caption" color="text.secondary">
            A aplicação ocupará aproximadamente 5-10 MB de espaço no seu dispositivo.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Agora não
          </Button>
          <Button 
            variant="contained" 
            onClick={handleInstallClick}
            startIcon={<GetApp />}
          >
            Instalar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Alert de offline */}
      <Snackbar
        open={showOfflineAlert}
        onClose={handleDismissOffline}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleDismissOffline} 
          severity="warning" 
          icon={<Offline />}
        >
          Você está offline. Funcionalidade limitada disponível.
        </Alert>
      </Snackbar>
    </>
  );
};
