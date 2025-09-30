import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar recursos de tradução
import ptBR from './locales/pt-BR.json';
import enUS from './locales/en-US.json';

// Verificar se os recursos foram carregados corretamente
if (!ptBR || !enUS) {
  console.error('Failed to load translation resources');
}

// Configuração do i18n
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    // Idioma padrão
    fallbackLng: 'pt-BR',
    
    // Idiomas disponíveis
    supportedLngs: ['pt', 'pt-BR', 'en', 'en-US'],
    
    // Recursos de tradução
    resources: {
      'pt': {
        translation: ptBR
      },
      'pt-BR': {
        translation: ptBR
      },
      'en': {
        translation: enUS
      },
      'en-US': {
        translation: enUS
      }
    },
    
    // Configurações de detecção de idioma
    detection: {
      // Ordem de detecção
      order: ['localStorage', 'navigator', 'htmlTag'],
      
      // Chave no localStorage
      lookupLocalStorage: 'pokemon-app-language',
      
      // Cache do idioma detectado
      caches: ['localStorage'],
      
      // Verificar se o idioma está disponível
      checkWhitelist: true,
      
      // Converter códigos de idioma do navegador
      convertDetectedLanguage: (lng) => {
        // Se o idioma já está nos suportados, usar como está
        if (['pt', 'pt-BR', 'en', 'en-US'].includes(lng)) {
          return lng;
        }
        
        // Converter códigos comuns do navegador para nossos códigos
        if (lng.startsWith('pt-')) {
          return 'pt-BR';
        }
        if (lng.startsWith('en-')) {
          return 'en-US';
        }
        
        // Se não for um idioma suportado, usar pt-BR como padrão
        return 'pt-BR';
      }
    },
    
    // Configurações de interpolação
    interpolation: {
      escapeValue: false // React já faz escape
    },
    
    // Configurações de debug (apenas em desenvolvimento)
    debug: import.meta.env.DEV,
    
    // Configurações de namespace
    defaultNS: 'translation',
    ns: ['translation'],
    
    // Configurações de carregamento
    load: 'all',
    nonExplicitSupportedLngs: false,
    
    // Configurações de fallback
    fallbackNS: false,
    
    // Configurações de pluralização
    pluralSeparator: '_',
    contextSeparator: '_',
    
    // Configurações de recursos
    saveMissing: false,
    updateMissing: false,
    
    // Configurações de react
    react: {
      useSuspense: false
    }
  })
  .then(() => {
    // Log de sucesso na inicialização
    if (import.meta.env.DEV) {
      console.log('i18n initialized successfully with language:', i18n.language);
      console.log('Available languages:', i18n.languages);
      console.log('Supported languages:', i18n.options.supportedLngs);
    }
    
    // Verificar se o idioma atual está nos suportados
    const currentLang = i18n.language;
    const supportedLngs = i18n.options.supportedLngs;
    
    if (!supportedLngs.includes(currentLang)) {
      console.warn(`Current language ${currentLang} is not in supported languages. Falling back to pt-BR.`);
      i18n.changeLanguage('pt-BR');
    } else {
      console.log(`Language ${currentLang} is supported and active.`);
    }
  })
  .catch((error) => {
    console.error('Error initializing i18n:', error);
    // Tentar inicializar com fallback
    i18n.changeLanguage('pt-BR');
  });

export default i18n;