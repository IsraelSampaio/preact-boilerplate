# 🧪 Estratégias de Teste

## 📋 Visão Geral

Esta documentação detalha as estratégias de teste implementadas na aplicação Pokémon, incluindo configuração, padrões e boas práticas para garantir qualidade e confiabilidade do código.

## 🏗️ Arquitetura de Testes

### 1. **Stack de Testes**

```
Ferramentas:
├── Vitest           # Test runner e framework
├── Testing Library  # Utilitários para testes de componentes
├── JSdom           # Environment DOM para testes
└── ESLint          # Linting para arquivos de teste
```

### 2. **Estrutura de Testes**

```
src/
├── test/                           # Configuração global de testes
│   └── setup.js
├── features/
│   ├── auth/
│   │   └── components/
│   │       └── __tests__/         # Testes de componentes
│   │           └── LoginForm.test.jsx
│   └── pokemon/
│       └── services/
│           └── __tests__/         # Testes de services
│               └── pokemonApi.test.js
└── __tests__/                     # Testes de integração
    ├── integration/
    │   ├── comparison.test.jsx
    │   └── favorites.test.jsx
    └── e2e/
        └── pokemon-app-flow.test.jsx
```

### 3. **Tipos de Testes**

#### **Unit Tests**
- Funções utilitárias
- Custom hooks isolados
- Services e APIs
- DTOs e transformações

#### **Component Tests**
- Renderização de componentes
- Interações do usuário
- Props e states
- Event handlers

#### **Integration Tests**
- Fluxos completos de features
- Integração entre componentes
- Estados compartilhados
- API + UI integration

## ⚙️ Configuração de Testes

### 1. **Configuração do Vitest**

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
```

### 2. **Setup Global**

```javascript
// src/test/setup.js
import '@testing-library/jest-dom';
import { beforeEach, vi } from 'vitest';

// Mock global do fetch
global.fetch = vi.fn();

// Cleanup após cada teste
beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = '';
});

// Mock do console para testes mais limpos
global.console = {
  ...console,
  // Silenciar logs em testes, mas manter errors e warns
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: console.warn,
  error: console.error,
};
```

## 🎯 Padrões de Teste

### 1. **Testes de Componentes**

#### **Estrutura Padrão**
```javascript
// src/features/auth/components/__tests__/LoginForm.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../LoginForm.jsx';

// Mock de dependencies
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    login: vi.fn(),
    isLoading: false,
    error: null,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the login form correctly', () => {
    render(<LoginForm />);
    
    expect(screen.getByText('Pokémon App')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should validate required fields', () => {
    render(<LoginForm />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    expect(submitButton).toBeDisabled();
  });

  it('should enable button when fields are filled', () => {
    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    
    expect(submitButton).not.toBeDisabled();
  });

  it('should call login function on form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    
    vi.mocked(require('@/hooks/useAuth').useAuth).mockReturnValue({
      login: mockLogin,
      isLoading: false,
      error: null,
    });

    render(<LoginForm />);
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    
    fireEvent.change(emailInput, { target: { value: 'admin@pokemon.com' } });
    fireEvent.change(passwordInput, { target: { value: 'admin123' } });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@pokemon.com', 'admin123');
    });
  });
});
```

#### **Padrões de Interação**
```javascript
// ✅ Testes de interação do usuário
describe('User Interactions', () => {
  it('should toggle password visibility', () => {
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText('Senha');
    const toggleButton = screen.getByLabelText('toggle password visibility');
    
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'text');
    
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should submit form with Enter key', async () => {
    const mockLogin = vi.fn();
    // Setup mock...
    
    render(<LoginForm />);
    
    const passwordInput = screen.getByLabelText('Senha');
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.keyPress(passwordInput, { key: 'Enter', code: 'Enter' });
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });
});
```

### 2. **Testes de Services**

#### **Mock de Fetch API**
```javascript
// src/services/__tests__/pokemonApi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonApiService } from '../pokemonApi.js';
import { ApiErrorDTO } from '@/dto/api/index.js';

// Mock global do fetch
global.fetch = vi.fn();

describe('PokemonApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPokemonList', () => {
    it('deve retornar lista de Pokémon com sucesso', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await PokemonApiService.getPokemonList(0, 20);

      expect(fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?offset=0&limit=20'
      );
      expect(result).toBeInstanceOf(Object);
      expect(result.count).toBe(2);
      expect(result.results).toHaveLength(2);
    });

    it('deve lançar erro quando a requisição falha', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        status: 404,
      });

      await expect(PokemonApiService.getPokemonList()).rejects.toThrow(ApiErrorDTO);
    });

    it('deve tratar erros de rede', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network Error'));

      await expect(PokemonApiService.getPokemonList()).rejects.toThrow(ApiErrorDTO);
    });
  });

  describe('getPokemonById', () => {
    it('deve retornar Pokémon específico', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        sprites: {
          front_default: 'https://example.com/pikachu.png',
        },
        types: [{ slot: 1, type: { name: 'electric' } }],
        stats: [],
        abilities: [],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await PokemonApiService.getPokemonById(25);

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
      expect(result.id).toBe(25);
      expect(result.name).toBe('pikachu');
    });

    it('deve lançar erro quando Pokémon não é encontrado', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
        status: 404,
      });

      await expect(PokemonApiService.getPokemonById(999)).rejects.toThrow(ApiErrorDTO);
    });
  });
});
```

### 3. **Testes de Custom Hooks**

```javascript
// src/hooks/__tests__/useAuth.test.js
import { renderHook, act } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Provider } from 'react-redux';
import { useAuth } from '../useAuth.js';
import { store } from '@/store/index.js';

// Wrapper com Provider
const wrapper = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store state
    store.dispatch({ type: 'auth/logout' });
  });

  it('should initialize with default state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should login successfully with valid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login('admin@pokemon.com', 'admin123');
      expect(loginResult.success).toBe(true);
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual({
      id: '1',
      email: 'admin@pokemon.com',
      name: 'Administrator',
    });
  });

  it('should fail login with invalid credentials', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      const loginResult = await result.current.login('wrong@email.com', 'wrongpass');
      expect(loginResult.success).toBe(false);
      expect(loginResult.error).toBe('Credenciais inválidas');
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBe('Credenciais inválidas');
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Login first
    await act(async () => {
      await result.current.login('admin@pokemon.com', 'admin123');
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
  });
});
```

### 4. **Testes de DTOs**

```javascript
// src/dto/__tests__/pokemonDTO.test.js
import { describe, it, expect } from 'vitest';
import { PokemonDTO, PokemonListResponseDTO } from '../api/index.js';

describe('PokemonDTO', () => {
  it('should create DTO with default values', () => {
    const dto = new PokemonDTO({});

    expect(dto.id).toBe(0);
    expect(dto.name).toBe('');
    expect(dto.height).toBe(0);
    expect(dto.weight).toBe(0);
  });

  it('should calculate height in meters correctly', () => {
    const dto = new PokemonDTO({ height: 40 });
    expect(dto.getHeightInMeters()).toBe(4);
  });

  it('should calculate weight in kg correctly', () => {
    const dto = new PokemonDTO({ weight: 600 });
    expect(dto.getWeightInKg()).toBe(60);
  });

  it('should get primary type correctly', () => {
    const dto = new PokemonDTO({
      types: [
        { slot: 1, type: { name: 'electric', url: '' } },
        { slot: 2, type: { name: 'flying', url: '' } }
      ]
    });

    expect(dto.getPrimaryType()).toBe('electric');
  });

  it('should handle missing types gracefully', () => {
    const dto = new PokemonDTO({ types: [] });
    expect(dto.getPrimaryType()).toBe('unknown');
  });

  it('should transform to internal format correctly', () => {
    const mockData = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: { front_default: 'image.png' },
      types: [{ slot: 1, type: { name: 'electric', url: '' } }],
      stats: [],
      abilities: []
    };

    const dto = new PokemonDTO(mockData);
    const internal = dto.toInternal();

    expect(internal.id).toBe(25);
    expect(internal.name).toBe('pikachu');
    expect(internal.heightInMeters).toBe(0.4);
    expect(internal.weightInKg).toBe(6);
    expect(internal.primaryType).toBe('electric');
  });
});

describe('PokemonListResponseDTO', () => {
  it('should create DTO from API response', () => {
    const mockResponse = {
      count: 1154,
      next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
      previous: null,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }
      ]
    };

    const dto = new PokemonListResponseDTO(mockResponse);

    expect(dto.count).toBe(1154);
    expect(dto.next).toBe('https://pokeapi.co/api/v2/pokemon?offset=20&limit=20');
    expect(dto.results).toHaveLength(1);
  });

  it('should transform to internal format', () => {
    const mockResponse = {
      count: 2,
      results: [
        { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
        { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' }
      ]
    };

    const dto = new PokemonListResponseDTO(mockResponse);
    const internal = dto.toInternal();

    expect(internal.count).toBe(2);
    expect(internal.results[0].id).toBe(25);
    expect(internal.results[1].id).toBe(6);
  });
});
```

## 🎪 Padrões de Mock

### 1. **Mock de Hooks**

```javascript
// Mock simples
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    user: { name: 'Test User' },
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

// Mock dinâmico
const mockUseAuth = vi.fn();
vi.mock('@/hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}));

// Em cada teste
mockUseAuth.mockReturnValue({
  isAuthenticated: false,
  // ... outros valores
});
```

### 2. **Mock de Store/Redux**

```javascript
// Mock do store completo
const mockStore = configureStore({
  reducer: {
    auth: (state = { isAuthenticated: false }) => state,
    pokemon: (state = { list: [] }) => state,
  },
});

// Wrapper para testes
const TestWrapper = ({ children }) => (
  <Provider store={mockStore}>
    {children}
  </Provider>
);
```

### 3. **Mock de Router**

```javascript
// Mock do router
vi.mock('preact-router', () => ({
  route: vi.fn(),
  Router: ({ children }) => <div>{children}</div>,
}));
```

## 🚀 Testes de Integração

### 1. **Fluxo Completo de Feature**

```javascript
// src/features/auth/__tests__/authFlow.test.jsx
describe('Authentication Flow', () => {
  it('should complete full login flow', async () => {
    const { rerender } = render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Verificar estado inicial (não autenticado)
    expect(screen.getByText('Login')).toBeInTheDocument();

    // Preencher formulário
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'admin@pokemon.com' }
    });
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'admin123' }
    });

    // Submeter
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }));

    // Aguardar redirecionamento
    await waitFor(() => {
      expect(screen.getByText('Pokédex')).toBeInTheDocument();
    });

    // Verificar estado autenticado
    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });
});
```

### 2. **Integração API + UI**

```javascript
describe('Pokemon List Integration', () => {
  beforeEach(() => {
    // Mock da API
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        count: 2,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' }
        ]
      })
    });
  });

  it('should load and display pokemon list', async () => {
    render(
      <Provider store={store}>
        <PokemonListPage />
      </Provider>
    );

    // Verificar loading
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    // Aguardar carregamento
    await waitFor(() => {
      expect(screen.getByText('pikachu')).toBeInTheDocument();
      expect(screen.getByText('charizard')).toBeInTheDocument();
    });

    // Verificar que loading sumiu
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });
});
```

## 📊 Coverage e Métricas

### 1. **Configuração de Coverage**

```javascript
// vite.config.js
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json'],
      reportsDirectory: './coverage',
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.config.js',
        '**/*.d.ts',
        '**/types/**',
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
});
```

### 2. **Scripts de Teste**

```json
// package.json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:run": "vitest run"
  }
}
```

## ✅ Boas Práticas

### 1. **Nomenclatura**
- Nomes descritivos e específicos
- Seguir padrão AAA (Arrange, Act, Assert)
- Usar `should` nos nomes dos testes

### 2. **Organização**
- Um arquivo de teste por arquivo de código
- Agrupar testes relacionados com `describe`
- Setup e cleanup apropriados

### 3. **Assertions**
- Assertions específicas e múltiplas
- Testar comportamento, não implementação
- Verificar side effects

### 4. **Mocking**
- Mock apenas o necessário
- Preferir injeção de dependência
- Verificar chamadas de mock quando relevante

## 🚫 Anti-Padrões Evitados

### ❌ Não fazer:
```javascript
// Testes muito genéricos
it('should work', () => {
  expect(true).toBe(true); // ❌
});

// Mock excessivo
vi.mock('../../everything.js'); // ❌

// Testes frágeis
expect(screen.getByText('Loading...')).toBeInTheDocument(); // ❌ Pode quebrar com mudança de texto
```

### ✅ Fazer:
```javascript
// Testes específicos
it('should display error message when login fails', () => {
  // Test implementation ✅
});

// Mock específico
vi.mock('@/hooks/useAuth', () => ({ /* specific mock */ })); // ✅

// Testes robustos
expect(screen.getByRole('progressbar')).toBeInTheDocument(); // ✅ Semântico
```

## 🚀 CI/CD Integration

### 1. **GitHub Actions**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
```

### 2. **Pre-commit Hooks**

```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    "*.{js,jsx}": [
      "eslint --fix",
      "npm run test:related"
    ]
  }
}
```
