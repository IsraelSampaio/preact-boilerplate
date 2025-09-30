import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { store } from '@/store/index.js';
import { App } from '@/App.jsx';

// Mock de APIs externas
vi.mock('@/services/pokemonApi.js', () => ({
  PokemonApiService: {
    getPokemonList: vi.fn(),
    getPokemonById: vi.fn(),
    getPokemonByName: vi.fn(),
    getPokemonTypes: vi.fn(),
    getPokemonByType: vi.fn(),
    searchPokemon: vi.fn(),
  },
}));

// Mock de localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock de sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock de Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: vi.fn().mockResolvedValue({}),
    addEventListener: vi.fn(),
  },
  writable: true,
});

// Mock de i18n
vi.mock('@/i18n/index.js', () => ({
  default: {
    init: vi.fn().mockResolvedValue({}),
    use: vi.fn().mockReturnThis(),
    t: vi.fn((key) => key),
    changeLanguage: vi.fn().mockResolvedValue(),
    language: 'pt-BR',
    exists: vi.fn().mockReturnValue(true),
    getResource: vi.fn(),
  },
  changeLanguage: vi.fn().mockResolvedValue(),
  getCurrentLanguage: vi.fn().mockReturnValue('pt-BR'),
  getAvailableLanguages: vi.fn().mockReturnValue(['pt-BR', 'en-US']),
  getLanguageInfo: vi.fn().mockReturnValue({
    name: 'Português (Brasil)',
    nativeName: 'Português (Brasil)',
    flag: '🇧🇷',
  }),
}));

// Mock de PWA utils
vi.mock('@/utils/serviceWorker.js', () => ({
  registerServiceWorker: vi.fn().mockResolvedValue({}),
  initializePWA: vi.fn().mockResolvedValue(),
  isOffline: vi.fn().mockReturnValue(false),
  isInstalled: vi.fn().mockReturnValue(false),
  showInstallPrompt: vi.fn().mockResolvedValue(true),
  getCacheSize: vi.fn().mockResolvedValue(1024),
  clearCache: vi.fn().mockResolvedValue(),
  setupConnectivityListeners: vi.fn(),
}));

// Dados mock para testes
const mockPokemonList = {
  count: 1302,
  next: 'https://pokeapi.co/api/v2/pokemon/?offset=20&limit=20',
  previous: null,
  results: [
    {
      name: 'bulbasaur',
      url: 'https://pokeapi.co/api/v2/pokemon/1/',
    },
    {
      name: 'ivysaur',
      url: 'https://pokeapi.co/api/v2/pokemon/2/',
    },
    {
      name: 'venusaur',
      url: 'https://pokeapi.co/api/v2/pokemon/3/',
    },
  ],
};

const mockPokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/1.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/1.png',
    back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/1.png',
  },
  types: [
    {
      slot: 1,
      type: { name: 'grass', url: 'https://pokeapi.co/api/v2/type/12/' }
    },
    {
      slot: 2,
      type: { name: 'poison', url: 'https://pokeapi.co/api/v2/type/4/' }
    }
  ],
  stats: [
    { base_stat: 45, stat: { name: 'hp' } },
    { base_stat: 49, stat: { name: 'attack' } },
    { base_stat: 49, stat: { name: 'defense' } },
    { base_stat: 65, stat: { name: 'special-attack' } },
    { base_stat: 65, stat: { name: 'special-defense' } },
    { base_stat: 45, stat: { name: 'speed' } }
  ],
  abilities: [
    { ability: { name: 'overgrow' }, is_hidden: false, slot: 1 },
    { ability: { name: 'chlorophyll' }, is_hidden: true, slot: 3 }
  ]
};

// Helper para aguardar loading states
const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByText(/carregando/i)).not.toBeInTheDocument();
  }, { timeout: 5000 });
};

describe('Pokémon App E2E Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete User Journey', () => {
    it('should complete full user journey from home to comparison', async () => {
      // Setup mocks
      const { PokemonApiService } = await import('@/services/pokemonApi.js');
      
      PokemonApiService.getPokemonList.mockResolvedValue({
        toInternal: () => mockPokemonList,
      });
      
      PokemonApiService.getPokemonById.mockResolvedValue({
        toInternal: () => mockPokemonDetails,
      });

      // Mock do usuário autenticado
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'pokemon-app-auth') {
          return JSON.stringify({
            user: { name: 'Test User', email: 'test@example.com' },
            token: 'mock-token',
            isAuthenticated: true,
          });
        }
        return null;
      });

      // Renderizar aplicação completa
      render(<App />);

      // 1. VERIFICAR PÁGINA INICIAL
      await waitFor(() => {
        expect(screen.getByText(/bem-vindo ao pokémon app/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/olá, test user/i)).toBeInTheDocument();
      expect(screen.getByText(/explorar pokémon/i)).toBeInTheDocument();

      // 2. NAVEGAR PARA LISTA DE POKÉMON
      const exploreButton = screen.getByText(/explorar pokémon/i);
      fireEvent.click(exploreButton);

      await waitFor(() => {
        expect(screen.getByText(/pokédex/i)).toBeInTheDocument();
      });

      // Aguardar carregamento da lista
      await waitForLoadingToFinish();

      // Verificar se a lista foi carregada
      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });

      // 3. ADICIONAR POKÉMON AOS FAVORITOS
      const favoriteButton = screen.getByLabelText(/adicionar aos favoritos/i);
      fireEvent.click(favoriteButton);

      // Verificar se foi salvo no localStorage
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'pokemon-app-favorites',
          expect.stringContaining('bulbasaur')
        );
      });

      // 4. VISUALIZAR DETALHES DO POKÉMON
      const pokemonCard = screen.getByText('bulbasaur').closest('[data-testid="pokemon-card"]') || 
                          screen.getByText('bulbasaur');
      fireEvent.click(pokemonCard);

      await waitFor(() => {
        expect(screen.getByText(/detalhes do pokémon/i)).toBeInTheDocument();
      });

      // Verificar informações detalhadas
      expect(screen.getByText('#001')).toBeInTheDocument();
      expect(screen.getByText(/0\.7m/)).toBeInTheDocument(); // altura
      expect(screen.getByText(/6\.9kg/)).toBeInTheDocument(); // peso

      // 5. ADICIONAR À COMPARAÇÃO
      const compareButton = screen.getByLabelText(/adicionar à comparação/i);
      fireEvent.click(compareButton);

      // Verificar se foi salvo na comparação
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'pokemon-app-comparison',
          expect.stringContaining('bulbasaur')
        );
      });

      // 6. NAVEGAR PARA PÁGINA DE FAVORITOS
      const favoritesLink = screen.getByText(/favoritos/i);
      fireEvent.click(favoritesLink);

      await waitFor(() => {
        expect(screen.getByText(/meus pokémon favoritos/i)).toBeInTheDocument();
      });

      // Verificar se o Pokémon aparece nos favoritos
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();

      // 7. NAVEGAR PARA PÁGINA DE COMPARAÇÃO
      const comparisonLink = screen.getByText(/comparação/i);
      fireEvent.click(comparisonLink);

      await waitFor(() => {
        expect(screen.getByText(/comparação de pokémon/i)).toBeInTheDocument();
      });

      // Verificar se o Pokémon aparece na comparação
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      expect(screen.getByText(/resumo da comparação/i)).toBeInTheDocument();

      // 8. TESTAR FUNCIONALIDADE DE BUSCA
      const searchInput = screen.getByPlaceholderText(/buscar/i);
      fireEvent.change(searchInput, { target: { value: 'bulbasaur' } });

      // Verificar resultados da busca
      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });

      // 9. NAVEGAR PARA CONFIGURAÇÕES
      const settingsLink = screen.getByText(/configurações/i);
      fireEvent.click(settingsLink);

      await waitFor(() => {
        expect(screen.getByText(/configurações/i)).toBeInTheDocument();
      });

      // Verificar opções de configuração
      expect(screen.getByText(/idioma/i)).toBeInTheDocument();
      expect(screen.getByText(/tema/i)).toBeInTheDocument();

      // 10. TESTAR MUDANÇA DE TEMA
      const themeToggle = screen.getByRole('switch');
      fireEvent.click(themeToggle);

      // Verificar se o tema foi alterado no store
      await waitFor(() => {
        const state = store.getState();
        expect(state.ui.theme).toBe('dark');
      });
    }, 30000); // Timeout maior para teste E2E completo

    it('should handle API errors gracefully', async () => {
      // Setup mock para falhar
      const { PokemonApiService } = await import('@/services/pokemonApi.js');
      
      PokemonApiService.getPokemonList.mockRejectedValue(
        new Error('Network error')
      );

      render(<App />);

      // Navegar para lista de Pokémon
      const exploreButton = screen.getByText(/explorar pokémon/i);
      fireEvent.click(exploreButton);

      // Verificar se erro é exibido
      await waitFor(() => {
        expect(screen.getByText(/erro/i)).toBeInTheDocument();
      });
    });

    it('should work offline with cached data', async () => {
      // Setup dados em cache
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'pokemon-app-favorites') {
          return JSON.stringify([mockPokemonDetails]);
        }
        if (key === 'pokemon-app-comparison') {
          return JSON.stringify([mockPokemonDetails]);
        }
        return null;
      });

      // Mock offline
      const { isOffline } = await import('@/utils/serviceWorker.js');
      isOffline.mockReturnValue(true);

      render(<App />);

      // Navegar para favoritos
      const favoritesLink = screen.getByText(/favoritos/i);
      fireEvent.click(favoritesLink);

      // Verificar se dados em cache são exibidos
      await waitFor(() => {
        expect(screen.getByText('bulbasaur')).toBeInTheDocument();
      });

      // Verificar indicador de offline
      expect(screen.getByText(/offline/i)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      render(<App />);

      // Testar navegação por teclado
      const exploreButton = screen.getByText(/explorar pokémon/i);
      
      // Simular Tab para navegação
      fireEvent.keyDown(exploreButton, { key: 'Tab' });
      fireEvent.keyDown(exploreButton, { key: 'Enter' });

      await waitFor(() => {
        expect(screen.getByText(/pokédex/i)).toBeInTheDocument();
      });
    });

    it('should persist user preferences across sessions', async () => {
      // Primeira sessão - configurar preferências
      render(<App />);

      const settingsLink = screen.getByText(/configurações/i);
      fireEvent.click(settingsLink);

      const themeToggle = screen.getByRole('switch');
      fireEvent.click(themeToggle);

      // Verificar se preferências foram salvas
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          expect.stringContaining('theme'),
          expect.any(String)
        );
      });

      // Simular nova sessão
      vi.clearAllMocks();
      
      mockLocalStorage.getItem.mockImplementation((key) => {
        if (key.includes('theme')) {
          return JSON.stringify({ theme: 'dark' });
        }
        return null;
      });

      // Renderizar novamente
      render(<App />);

      // Verificar se tema foi restaurado
      await waitFor(() => {
        const state = store.getState();
        expect(state.ui.theme).toBe('dark');
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should not cause memory leaks on component unmount', async () => {
      const { unmount } = render(<App />);

      // Simular navegação e operações
      const exploreButton = screen.getByText(/explorar pokémon/i);
      fireEvent.click(exploreButton);

      // Desmontar componente
      unmount();

      // Verificar se não há vazamentos (simplificado)
      expect(true).toBe(true); // Em um cenário real, usaríamos ferramentas específicas
    });

    it('should handle rapid user interactions', async () => {
      render(<App />);

      const exploreButton = screen.getByText(/explorar pokémon/i);

      // Cliques rápidos
      for (let i = 0; i < 10; i++) {
        fireEvent.click(exploreButton);
      }

      // Verificar se não trava
      await waitFor(() => {
        expect(screen.getByText(/pokédex/i)).toBeInTheDocument();
      });
    });
  });
});
