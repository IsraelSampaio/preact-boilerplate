import { useState } from 'preact/hooks';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import { Language, Check } from '@mui/icons-material';
import { useTranslation } from '@/hooks/useTranslation.js';

/**
 * Componente LanguageSelector
 * Permite ao usuário selecionar o idioma da aplicação
 */
export const LanguageSelector = ({ variant = 'select', size = 'medium' }) => {
  const { 
    currentLanguage, 
    setLanguage, 
    availableLanguages, 
    currentLanguageInfo,
    t 
  } = useTranslation();
  
  const [anchorEl, setAnchorEl] = useState(null);
  const [isChanging, setIsChanging] = useState(false);

  const languages = availableLanguages();
  const current = currentLanguageInfo();
  const isMenuOpen = Boolean(anchorEl);

  const handleLanguageChange = async (newLanguage) => {
    if (newLanguage === currentLanguage()) return;
    
    setIsChanging(true);
    
    try {
      await setLanguage(newLanguage);
      
      // Fechar menu se estiver aberto
      if (isMenuOpen) {
        setAnchorEl(null);
      }
      
      // Feedback visual de sucesso
      console.log(`Language changed to: ${newLanguage}`);
    } catch (error) {
      console.error('Failed to change language:', error);
    } finally {
      setIsChanging(false);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const renderMenuItem = (language) => (
    <MenuItem 
      key={language.code}
      value={language.code}
      onClick={() => handleLanguageChange(language.code)}
      selected={language.code === currentLanguage()}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
        <Typography component="span" sx={{ fontSize: '1.2em' }}>
          {language.flag}
        </Typography>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2">
            {language.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {language.nativeName}
          </Typography>
        </Box>
        {language.code === currentLanguage() && (
          <Check color="primary" fontSize="small" />
        )}
      </Box>
    </MenuItem>
  );

  // Renderização como Select (FormControl)
  if (variant === 'select') {
    return (
      <FormControl size={size} sx={{ minWidth: 120 }}>
        <InputLabel id="language-select-label">
          {t('settings.language.title')}
        </InputLabel>
        <Select
          labelId="language-select-label"
          value={currentLanguage()}
          label={t('settings.language.title')}
          onChange={(e) => handleLanguageChange(e.target.value)}
          disabled={isChanging}
        >
          {languages.map(renderMenuItem)}
        </Select>
      </FormControl>
    );
  }

  // Renderização como Menu com IconButton
  if (variant === 'menu') {
    return (
      <>
        <Tooltip title={t('settings.language.title')}>
          <IconButton
            size={size}
            onClick={handleMenuOpen}
            disabled={isChanging}
            sx={{
              color: isMenuOpen ? 'primary.main' : 'inherit',
            }}
          >
            <Language />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {languages.map((language) => (
            <MenuItem 
              key={language.code}
              onClick={() => handleLanguageChange(language.code)}
              selected={language.code === currentLanguage()}
            >
              <ListItemIcon>
                <Typography component="span" sx={{ fontSize: '1.2em' }}>
                  {language.flag}
                </Typography>
              </ListItemIcon>
              <ListItemText 
                primary={language.name}
                secondary={language.nativeName}
              />
              {language.code === currentLanguage() && (
                <Check color="primary" fontSize="small" sx={{ ml: 1 }} />
              )}
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  }

  // Renderização compacta (apenas flag e nome)
  if (variant === 'compact') {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          p: 1,
          borderRadius: 1,
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
        onClick={handleMenuOpen}
      >
        <Typography component="span" sx={{ fontSize: '1.2em' }}>
          {current.flag}
        </Typography>
        <Typography variant="body2">
          {current.name}
        </Typography>
        <Language fontSize="small" color="action" />
      </Box>
    );
  }

  // Renderização padrão como botões
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {languages.map((language) => (
        <Box
          key={language.code}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            cursor: 'pointer',
            border: '1px solid',
            borderColor: language.code === currentLanguage() ? 'primary.main' : 'divider',
            bgcolor: language.code === currentLanguage() ? 'primary.main' : 'transparent',
            color: language.code === currentLanguage() ? 'primary.contrastText' : 'text.primary',
            '&:hover': {
              bgcolor: language.code === currentLanguage() ? 'primary.dark' : 'action.hover',
            },
            transition: 'all 0.2s',
          }}
          onClick={() => handleLanguageChange(language.code)}
        >
          <Typography component="span" sx={{ fontSize: '1em' }}>
            {language.flag}
          </Typography>
          <Typography variant="caption">
            {language.code.split('-')[0].toUpperCase()}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
