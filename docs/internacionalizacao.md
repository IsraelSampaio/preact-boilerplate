# 🌍 Internacionalização (i18n)

## 📋 Visão Geral

Este projeto implementa sistema completo de internacionalização usando **react-i18next** e **i18next-browser-languagedetector**, permitindo suporte a múltiplos idiomas com detecção automática do idioma do usuário.

## 🏗️ Arquitetura de i18n

### 1. **Estrutura de Arquivos**

```
src/features/i18n/
├── hooks/
│   └── useTranslation.js      # Hook customizado para traduções
├── locales/                   # Arquivos de tradução
│   ├── en-US.json            # Traduções em inglês
│   └── pt-BR.json            # Traduções em português
├── services/                  # Serviços de i18n (futuro)
├── store/                     # Estado de idioma (futuro)
├── utils/                     # Utilitários de i18n (futuro)
└── index.js                   # Configuração principal do i18n
```

### 2. **Dependências**

```json
{
  "i18next": "^25.5.2",
  "i18next-browser-languagedetector": "^8.2.0",
  "react-i18next": "^15.7.3"
}
```

## ⚙️ Configuração

### 1. **Configuração Principal**

```javascript
// src/features/i18n/index.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importar traduções
import enUS from './locales/en-US.json';
import ptBR from './locales/pt-BR.json';

const resources = {
  'en-US': {
    translation: enUS,
  },
  'pt-BR': {
    translation: ptBR,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt-BR', // idioma padrão
    fallbackLng: 'en-US', // idioma de fallback
    
    interpolation: {
      escapeValue: false, // não é necessário para React
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
```

### 2. **Inicialização no App**

```javascript
// src/main.jsx
import { render } from 'preact';
import { App } from './App.jsx';
import './styles/index.scss';
import { initializePWA } from './utils/serviceWorker.js';
import './features/i18n/index.js'; // ✅ Importar configuração i18n

// Renderizar aplicação
render(<App />, document.getElementById('app'));
```

## 📝 Estrutura de Traduções

### 1. **Português (pt-BR.json)**

```json
{
  "app": {
    "title": "Pokédex",
    "subtitle": "Sua coleção completa de Pokémon"
  },
  "auth": {
    "login": {
      "title": "Entrar",
      "email": "Email",
      "password": "Senha",
      "submit": "Entrar",
      "invalidCredentials": "Credenciais inválidas"
    },
    "logout": "Sair"
  },
  "pokemon": {
    "list": {
      "title": "Lista de Pokémon",
      "search": "Buscar Pokémon...",
      "filter": "Filtrar por tipo",
      "noResults": "Nenhum Pokémon encontrado"
    },
    "details": {
      "height": "Altura",
      "weight": "Peso",
      "type": "Tipo",
      "abilities": "Habilidades"
    },
    "favorites": {
      "title": "Favoritos",
      "add": "Adicionar aos favoritos",
      "remove": "Remover dos favoritos",
      "empty": "Você não tem Pokémon favoritos ainda"
    }
  },
  "navigation": {
    "home": "Início",
    "pokemon": "Pokédex",
    "favorites": "Favoritos",
    "comparison": "Comparação",
    "settings": "Configurações"
  },
  "common": {
    "loading": "Carregando...",
    "error": "Erro",
    "retry": "Tentar novamente",
    "save": "Salvar",
    "cancel": "Cancelar",
    "close": "Fechar"
  }
}
```

### 2. **Inglês (en-US.json)**

```json
{
  "app": {
    "title": "Pokédex",
    "subtitle": "Your complete Pokémon collection"
  },
  "auth": {
    "login": {
      "title": "Sign In",
      "email": "Email",
      "password": "Password",
      "submit": "Sign In",
      "invalidCredentials": "Invalid credentials"
    },
    "logout": "Sign Out"
  },
  "pokemon": {
    "list": {
      "title": "Pokémon List",
      "search": "Search Pokémon...",
      "filter": "Filter by type",
      "noResults": "No Pokémon found"
    },
    "details": {
      "height": "Height",
      "weight": "Weight",
      "type": "Type",
      "abilities": "Abilities"
    },
    "favorites": {
      "title": "Favorites",
      "add": "Add to favorites",
      "remove": "Remove from favorites",
      "empty": "You don't have favorite Pokémon yet"
    }
  },
  "navigation": {
    "home": "Home",
    "pokemon": "Pokédex",
    "favorites": "Favorites",
    "comparison": "Comparison",
    "settings": "Settings"
  },
  "common": {
    "loading": "Loading...",
    "error": "Error",
    "retry": "Try again",
    "save": "Save",
    "cancel": "Cancel",
    "close": "Close"
  }
}
```

## 🎪 Hook Customizado

### 1. **useTranslation Hook**

```javascript
// src/features/i18n/hooks/useTranslation.js
import { useTranslation as useI18nTranslation } from 'react-i18next';

/**
 * Hook customizado para traduções
 * Encapsula o hook do react-i18next com funcionalidades extras
 */
export const useTranslation = (namespace = 'translation') => {
  const { t, i18n } = useI18nTranslation(namespace);

  /**
   * Muda o idioma da aplicação
   * @param {string} language - Código do idioma (pt-BR, en-US)
   */
  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
    } catch (error) {
      console.error('Erro ao mudar idioma:', error);
    }
  };

  /**
   * Obtém o idioma atual
   * @returns {string} Código do idioma atual
   */
  const getCurrentLanguage = () => {
    return i18n.language || 'pt-BR';
  };

  /**
   * Obtém lista de idiomas disponíveis
   * @returns {Array} Lista de idiomas disponíveis
   */
  const getAvailableLanguages = () => {
    return [
      { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
      { code: 'en-US', name: 'English', flag: '🇺🇸' },
    ];
  };

  /**
   * Verifica se o idioma está carregado
   * @returns {boolean} True se carregado
   */
  const isLanguageLoaded = () => {
    return i18n.isInitialized;
  };

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isLanguageLoaded,
    currentLanguage: getCurrentLanguage(),
    availableLanguages: getAvailableLanguages(),
  };
};
```

## 🎨 Componente Seletor de Idioma

### 1. **LanguageSelector Component**

```javascript
// src/components/LanguageSelector.jsx
import { useState } from 'preact/hooks';
import { 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Typography 
} from '@mui/material';
import { useTranslation } from '@/features/i18n/hooks/useTranslation.js';

export const LanguageSelector = ({ variant = 'outlined', size = 'medium' }) => {
  const { currentLanguage, availableLanguages, changeLanguage } = useTranslation();
  const [isChanging, setIsChanging] = useState(false);

  const handleLanguageChange = async (event) => {
    const newLanguage = event.target.value;
    if (newLanguage === currentLanguage) return;

    setIsChanging(true);
    try {
      await changeLanguage(newLanguage);
    } catch (error) {
      console.error('Erro ao alterar idioma:', error);
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <FormControl variant={variant} size={size} sx={{ minWidth: 120 }}>
      <InputLabel id="language-selector-label">Idioma</InputLabel>
      <Select
        labelId="language-selector-label"
        id="language-selector"
        value={currentLanguage}
        label="Idioma"
        onChange={handleLanguageChange}
        disabled={isChanging}
      >
        {availableLanguages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <span>{language.flag}</span>
              <Typography variant="body2">{language.name}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
```

## 🔧 Uso em Componentes

### 1. **Componente Básico**

```javascript
// Exemplo de uso básico
import { useTranslation } from '@/features/i18n/hooks/useTranslation.js';

export const HomePage = () => {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('app.title')}</h1>
      <p>{t('app.subtitle')}</p>
      <button>{t('navigation.pokemon')}</button>
    </div>
  );
};
```

### 2. **Componente com Interpolação**

```javascript
// Exemplo com interpolação de variáveis
export const PokemonCard = ({ pokemon }) => {
  const { t } = useTranslation();

  return (
    <div>
      <h3>{pokemon.name}</h3>
      <p>{t('pokemon.details.height')}: {pokemon.height / 10}m</p>
      <p>{t('pokemon.details.weight')}: {pokemon.weight / 10}kg</p>
    </div>
  );
};
```

### 3. **Componente com Pluralização**

```javascript
// Exemplo com pluralização (necessário atualizar JSON)
export const SearchResults = ({ results }) => {
  const { t } = useTranslation();

  return (
    <div>
      <p>
        {t('pokemon.list.resultsCount', { 
          count: results.length 
        })}
      </p>
      {/* Lista de resultados */}
    </div>
  );
};
```

## 📊 Organização de Chaves

### 1. **Convenção de Nomenclatura**

```
{feature}.{section}.{element}

Exemplos:
- auth.login.title
- pokemon.list.search
- navigation.home
- common.loading
```

### 2. **Agrupamento Lógico**

- **app**: Informações gerais da aplicação
- **auth**: Autenticação e autorização
- **pokemon**: Funcionalidades relacionadas a Pokémon
- **navigation**: Elementos de navegação
- **common**: Textos reutilizáveis

## ✅ Boas Práticas

### 1. **Organização de Chaves**
- Use nomenclatura consistente e hierárquica
- Agrupe por funcionalidade
- Mantenha chaves comuns em seção separada

### 2. **Performance**
- Carregue apenas idiomas necessários
- Use lazy loading para traduções grandes
- Cache traduções no localStorage

### 3. **Manutenção**
- Mantenha traduções sincronizadas
- Use ferramentas de validação de JSON
- Documente contexto de uso das chaves

### 4. **Acessibilidade**
- Considere direção de texto (RTL/LTR)
- Teste com diferentes comprimentos de texto
- Valide com leitores de tela

## 🧪 Testabilidade

### 1. **Mock em Testes**

```javascript
// src/test/mocks/i18n.js
export const mockTranslation = {
  t: (key) => key, // Retorna a própria chave
  changeLanguage: vi.fn(),
  getCurrentLanguage: () => 'pt-BR',
  getAvailableLanguages: () => [
    { code: 'pt-BR', name: 'Português' },
    { code: 'en-US', name: 'English' },
  ],
};

// Uso em testes
vi.mock('@/features/i18n/hooks/useTranslation', () => ({
  useTranslation: () => mockTranslation,
}));
```

### 2. **Testes de Componente**

```javascript
describe('LanguageSelector', () => {
  it('should render available languages', () => {
    render(<LanguageSelector />);
    
    expect(screen.getByText('Português')).toBeInTheDocument();
    expect(screen.getByText('English')).toBeInTheDocument();
  });

  it('should change language when selected', async () => {
    const { changeLanguage } = mockTranslation;
    render(<LanguageSelector />);
    
    fireEvent.change(screen.getByRole('combobox'), {
      target: { value: 'en-US' }
    });
    
    await waitFor(() => {
      expect(changeLanguage).toHaveBeenCalledWith('en-US');
    });
  });
});
```

## 🚀 Expansões Futuras

### 1. **Carregamento Dinâmico**
- Lazy loading de traduções
- API para traduções dinâmicas
- Cache inteligente

### 2. **Funcionalidades Avançadas**
- Pluralização complexa
- Formatação de datas/números
- Contexto de tradução

### 3. **Ferramentas de Desenvolvimento**
- Gerador de chaves de tradução
- Validador de traduções
- Interface de gerenciamento

## 🌐 Suporte a Idiomas

### Idiomas Implementados
- ✅ Português Brasileiro (pt-BR)
- ✅ English (en-US)

### Idiomas Planejados
- 🔄 Español (es-ES)
- 🔄 Français (fr-FR)
- 🔄 日本語 (ja-JP)

---

*Esta documentação é mantida atualizada com a implementação atual do sistema de i18n.*

