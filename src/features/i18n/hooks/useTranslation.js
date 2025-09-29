import { useTranslation as useI18nTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, getAvailableLanguages, getLanguageInfo } from '@/i18n/index.js';

/**
 * Hook personalizado para tradução
 * Extensão do useTranslation do react-i18next com funcionalidades adicionais
 */
export const useTranslation = (namespace = 'translation') => {
  const { t, i18n, ready } = useI18nTranslation(namespace);

  /**
   * Função de tradução com fallback
   * @param {string} key Chave da tradução
   * @param {object} options Opções de interpolação e configuração
   * @returns {string} Texto traduzido
   */
  const translate = (key, options = {}) => {
    if (!ready) {
      return key; // Retorna a chave enquanto não carrega
    }

    try {
      const translated = t(key, options);
      
      // Se a tradução é igual à chave, pode ser que não exista
      if (translated === key && !options.defaultValue) {
        console.warn(`Translation missing for key: ${key}`);
      }
      
      return translated;
    } catch (error) {
      console.error(`Translation error for key "${key}":`, error);
      return key;
    }
  };

  /**
   * Muda o idioma da aplicação
   * @param {string} language Código do idioma (pt-BR, en-US)
   * @returns {Promise} Promise que resolve quando o idioma for alterado
   */
  const setLanguage = async (language) => {
    try {
      await changeLanguage(language);
      
      // Salvar preferência no localStorage
      localStorage.setItem('pokemon-app-language', language);
      
      // Disparar evento customizado para outros componentes
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language } 
      }));
      
      return true;
    } catch (error) {
      console.error('Error changing language:', error);
      return false;
    }
  };

  /**
   * Obtém informações do idioma atual
   * @returns {object} Informações do idioma
   */
  const currentLanguageInfo = () => {
    const current = getCurrentLanguage();
    return getLanguageInfo(current);
  };

  /**
   * Obtém lista de idiomas disponíveis com informações
   * @returns {Array} Lista de idiomas disponíveis
   */
  const availableLanguages = () => {
    return getAvailableLanguages().map(lng => ({
      code: lng,
      ...getLanguageInfo(lng),
    }));
  };

  /**
   * Verifica se está carregando traduções
   * @returns {boolean} True se ainda está carregando
   */
  const isLoading = () => {
    return !ready;
  };

  /**
   * Obtém o idioma atual
   * @returns {string} Código do idioma atual
   */
  const currentLanguage = () => {
    return getCurrentLanguage();
  };

  /**
   * Traduz baseado em contagem (singular/plural)
   * @param {string} key Chave base da tradução
   * @param {number} count Número para determinar plural
   * @param {object} options Opções adicionais
   * @returns {string} Texto traduzido
   */
  const translateCount = (key, count, options = {}) => {
    const pluralKey = count === 1 ? key : `${key}_other`;
    
    return translate(pluralKey, {
      count,
      ...options,
    });
  };

  /**
   * Traduz e formata com interpolação de data
   * @param {string} key Chave da tradução
   * @param {Date} date Data para formatar
   * @param {object} options Opções de formatação
   * @returns {string} Texto traduzido com data formatada
   */
  const translateDate = (key, date, options = {}) => {
    const formatter = new Intl.DateTimeFormat(currentLanguage(), {
      dateStyle: 'medium',
      timeStyle: 'short',
      ...options,
    });
    
    return translate(key, {
      date: formatter.format(date),
    });
  };

  /**
   * Traduz e formata números
   * @param {string} key Chave da tradução
   * @param {number} number Número para formatar
   * @param {object} options Opções de formatação
   * @returns {string} Texto traduzido com número formatado
   */
  const translateNumber = (key, number, options = {}) => {
    const formatter = new Intl.NumberFormat(currentLanguage(), options);
    
    return translate(key, {
      number: formatter.format(number),
    });
  };

  /**
   * Traduz array de chaves e retorna array de traduções
   * @param {Array<string>} keys Array de chaves
   * @param {object} options Opções comuns para todas as traduções
   * @returns {Array<string>} Array de traduções
   */
  const translateMultiple = (keys, options = {}) => {
    return keys.map(key => translate(key, options));
  };

  /**
   * Verifica se uma tradução existe
   * @param {string} key Chave da tradução
   * @returns {boolean} True se a tradução existe
   */
  const hasTranslation = (key) => {
    return i18n.exists(key);
  };

  /**
   * Obtém tradução raw (sem interpolação)
   * @param {string} key Chave da tradução
   * @returns {string} Tradução raw
   */
  const getRawTranslation = (key) => {
    return i18n.getResource(currentLanguage(), 'translation', key);
  };

  return {
    // Função principal de tradução (alias para melhor DX)
    t: translate,
    translate,
    
    // Gerenciamento de idioma
    setLanguage,
    currentLanguage,
    currentLanguageInfo,
    availableLanguages,
    
    // Estado
    isLoading,
    ready,
    
    // Funções utilitárias
    translateCount,
    translateDate,
    translateNumber,
    translateMultiple,
    hasTranslation,
    getRawTranslation,
    
    // Instância do i18n (para casos avançados)
    i18n,
  };
};
