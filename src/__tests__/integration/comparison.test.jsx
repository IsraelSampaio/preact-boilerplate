import { render, screen, fireEvent, waitFor } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@/store/slices/authSlice.js';
import { pokemonSlice } from '@/store/slices/pokemonSlice.js';
import { uiSlice } from '@/store/slices/uiSlice.js';
import { comparisonSlice } from '@/store/slices/comparisonSlice.js';
import { ComparisonPage } from '@/features/pokemon/pages/ComparisonPage.jsx';
import { PokemonDetailsPage } from '@/features/pokemon/pages/PokemonDetailsPage.jsx';

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

// Mock dados de Pokémon para teste
const mockPokemon1 = {
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

const mockPokemon2 = {
  id: 4,
  name: 'charmander',
  height: 6,
  weight: 85,
  base_experience: 62,
  sprites: {
    front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
    back_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/4.png',
    front_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/4.png',
    back_shiny: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/4.png',
  },
  types: [
    {
      slot: 1,
      type: { name: 'fire', url: 'https://pokeapi.co/api/v2/type/10/' }
    }
  ],
  stats: [
    { base_stat: 39, stat: { name: 'hp' } },
    { base_stat: 52, stat: { name: 'attack' } },
    { base_stat: 43, stat: { name: 'defense' } },
    { base_stat: 60, stat: { name: 'special-attack' } },
    { base_stat: 50, stat: { name: 'special-defense' } },
    { base_stat: 65, stat: { name: 'speed' } }
  ],
  abilities: [
    { ability: { name: 'blaze' }, is_hidden: false, slot: 1 },
    { ability: { name: 'solar-power' }, is_hidden: true, slot: 3 }
  ]
};

// Mock do router
const mockRoute = vi.fn();
vi.mock('preact-router', () => ({
  route: mockRoute,
}));

// Mock do i18n
vi.mock('@/hooks/useTranslation.js', () => ({
  useTranslation: () => ({
    t: (key, options = {}) => {
      const translations = {
        'comparison.title': 'Comparação de Pokémon',
        'comparison.subtitle': `Comparação de Pokémon (${options.count || 0})`,
        'comparison.empty.title': '🔍 Nenhum Pokémon para comparar',
        'comparison.empty.description': 'Adicione Pokémon à comparação clicando no ícone de comparação nas páginas de detalhes.',
        'comparison.empty.button': 'Explorar Pokémon',
        'comparison.summary.title': '📊 Resumo da Comparação',
        'comparison.summary.averageHeight': 'Altura Média',
        'comparison.summary.averageWeight': 'Peso Médio',
        'comparison.summary.averageBaseExp': 'Exp. Base Média',
        'comparison.summary.mostCommonType': 'Tipo Mais Comum',
        'comparison.summary.highestStat': 'Maior Stat',
        'comparison.summary.lowestStat': 'Menor Stat',
        'comparison.table.title': '📋 Comparação Detalhada',
        'comparison.table.attribute': 'Atributo',
        'comparison.actions.clear': 'Limpar todos',
        'comparison.actions.clearConfirm': 'Limpar toda a comparação?',
        'comparison.actions.clearDescription': `Esta ação removerá todos os ${options.count || 0} Pokémon da comparação. Esta ação não pode ser desfeita.`,
        'comparison.actions.clearButton': 'Sim, limpar todos',
        'comparison.actions.add': 'Adicionar à comparação',
        'comparison.actions.remove': 'Remover da comparação',
        'comparison.actions.maxReached': 'Máximo de 4 Pokémon podem ser comparados simultaneamente',
        'actions.cancel': 'Cancelar',
        'actions.back': 'Voltar',
        'pokemon.stats.hp': 'HP',
        'pokemon.stats.attack': 'Ataque',
        'pokemon.stats.defense': 'Defesa',
        'pokemon.stats.special-attack': 'Ataque Especial',
        'pokemon.stats.special-defense': 'Defesa Especial',
        'pokemon.stats.speed': 'Velocidade',
        'pokemon.details.height': 'Altura',
        'pokemon.details.weight': 'Peso',
        'pokemon.details.baseExperience': 'Experiência Base',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock do MainLayout
vi.mock('@/components/layout.js', () => ({
  MainLayout: ({ children, title }) => (
    <div data-testid="main-layout" data-title={title}>
      {children}
    </div>
  ),
}));

// Mock das APIs
vi.mock('@/services/pokemonApi.js', () => ({
  PokemonApiService: {
    getPokemonById: vi.fn(),
  },
}));

/**
 * Função auxiliar para criar store de teste
 */
const createTestStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      pokemon: pokemonSlice.reducer,
      ui: uiSlice.reducer,
      comparison: comparisonSlice.reducer,
    },
    preloadedState: {
      auth: { user: { name: 'Test User' }, isAuthenticated: true },
      pokemon: { list: [], selected: null, isLoading: false, error: null },
      ui: { theme: 'light' },
      comparison: { list: [], isComparing: false, maxItems: 4, error: null },
      ...initialState,
    },
  });
};

/**
 * Função auxiliar para renderizar com Provider
 */
const renderWithStore = (component, store) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Comparison Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
    mockRoute.mockClear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Empty Comparison State', () => {
    it('should display empty state when no pokémon in comparison', () => {
      const store = createTestStore();
      
      renderWithStore(<ComparisonPage />, store);
      
      expect(screen.getByText('🔍 Nenhum Pokémon para comparar')).toBeInTheDocument();
      expect(screen.getByText('Adicione Pokémon à comparação clicando no ícone de comparação nas páginas de detalhes.')).toBeInTheDocument();
      expect(screen.getByText('Explorar Pokémon')).toBeInTheDocument();
    });

    it('should navigate back to pokemon list when clicking explore button', () => {
      const store = createTestStore();
      
      renderWithStore(<ComparisonPage />, store);
      
      const exploreButton = screen.getByText('Explorar Pokémon');
      fireEvent.click(exploreButton);
      
      expect(mockRoute).toHaveBeenCalledWith('/pokemon');
    });
  });

  describe('Comparison with Data', () => {
    it('should display pokémon cards when data exists', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      expect(screen.getByText('Comparação de Pokémon (2)')).toBeInTheDocument();
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
      expect(screen.getByText('Charmander')).toBeInTheDocument();
    });

    it('should display comparison summary with calculated statistics', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // Verificar resumo da comparação
      expect(screen.getByText('📊 Resumo da Comparação')).toBeInTheDocument();
      
      // Altura média: (7 + 6) / 2 / 10 = 0.65m
      expect(screen.getByText('0.7m')).toBeInTheDocument();
      
      // Peso médio: (69 + 85) / 2 / 10 = 7.7kg
      expect(screen.getByText('7.7kg')).toBeInTheDocument();
      
      // Experiência base média: (64 + 62) / 2 = 63
      expect(screen.getByText('63')).toBeInTheDocument();
    });

    it('should display detailed comparison table', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // Verificar tabela de comparação
      expect(screen.getByText('📋 Comparação Detalhada')).toBeInTheDocument();
      expect(screen.getByText('Atributo')).toBeInTheDocument();
      
      // Verificar linhas da tabela
      expect(screen.getByText('Altura')).toBeInTheDocument();
      expect(screen.getByText('Peso')).toBeInTheDocument();
      expect(screen.getByText('Experiência Base')).toBeInTheDocument();
      
      // Verificar estatísticas
      expect(screen.getByText('HP')).toBeInTheDocument();
      expect(screen.getByText('Ataque')).toBeInTheDocument();
      expect(screen.getByText('Defesa')).toBeInTheDocument();
    });

    it('should remove pokémon from comparison when delete button is clicked', async () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // Encontrar e clicar no botão de deletar do primeiro Pokémon
      const deleteButtons = screen.getAllByTestId('delete-button');
      fireEvent.click(deleteButtons[0]);
      
      await waitFor(() => {
        const state = store.getState();
        expect(state.comparison.list).toHaveLength(1);
        expect(state.comparison.list[0].name).toBe('charmander');
      });
    });

    it('should open clear confirmation dialog when clear all is clicked', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      const clearButton = screen.getByText('Limpar todos');
      fireEvent.click(clearButton);
      
      expect(screen.getByText('Limpar toda a comparação?')).toBeInTheDocument();
      expect(screen.getByText('Esta ação removerá todos os 2 Pokémon da comparação. Esta ação não pode ser desfeita.')).toBeInTheDocument();
    });

    it('should clear all pokémon when confirmed', async () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // Abrir dialog de confirmação
      const clearButton = screen.getByText('Limpar todos');
      fireEvent.click(clearButton);
      
      // Confirmar limpeza
      const confirmButton = screen.getByText('Sim, limpar todos');
      fireEvent.click(confirmButton);
      
      await waitFor(() => {
        const state = store.getState();
        expect(state.comparison.list).toHaveLength(0);
      });
    });
  });

  describe('Adding Pokémon to Comparison', () => {
    it('should add pokémon to comparison from details page', async () => {
      const store = createTestStore({
        pokemon: {
          selected: mockPokemon1,
          isLoading: false,
          error: null,
        },
        comparison: {
          list: [],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      // Mock da API para carregar detalhes
      const { PokemonApiService } = await import('@/services/pokemonApi.js');
      PokemonApiService.getPokemonById.mockResolvedValue({
        toInternal: () => mockPokemon1,
      });
      
      renderWithStore(<PokemonDetailsPage id="1" />, store);
      
      await waitFor(() => {
        const compareButton = screen.getByLabelText(/adicionar à comparação/i);
        fireEvent.click(compareButton);
      });
      
      await waitFor(() => {
        const state = store.getState();
        expect(state.comparison.list).toHaveLength(1);
        expect(state.comparison.list[0].name).toBe('bulbasaur');
      });
    });

    it('should show error when trying to add more than maximum allowed', async () => {
      const maxPokemon = [mockPokemon1, mockPokemon2, { ...mockPokemon1, id: 3 }, { ...mockPokemon2, id: 5 }];
      
      const store = createTestStore({
        pokemon: {
          selected: { ...mockPokemon1, id: 6 },
          isLoading: false,
          error: null,
        },
        comparison: {
          list: maxPokemon,
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      // Mock da API
      const { PokemonApiService } = await import('@/services/pokemonApi.js');
      PokemonApiService.getPokemonById.mockResolvedValue({
        toInternal: () => ({ ...mockPokemon1, id: 6 }),
      });
      
      renderWithStore(<PokemonDetailsPage id="6" />, store);
      
      await waitFor(() => {
        const compareButton = screen.getByLabelText(/adicionar à comparação/i);
        fireEvent.click(compareButton);
      });
      
      // Verificar se o erro é mostrado
      await waitFor(() => {
        const state = store.getState();
        expect(state.comparison.error).toBe('Máximo de 4 Pokémon podem ser comparados simultaneamente');
      });
    });
  });

  describe('Statistics Calculation', () => {
    it('should calculate average height correctly', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // (7 + 6) / 2 / 10 = 0.65m (arredondado para 0.7m)
      expect(screen.getByText('0.7m')).toBeInTheDocument();
    });

    it('should identify highest and lowest stats', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // O maior stat deve ser special-attack do bulbasaur (65)
      // O menor stat deve ser hp do charmander (39)
      expect(screen.getByText(/Maior Stat.*Ataque Especial.*65.*bulbasaur/)).toBeInTheDocument();
      expect(screen.getByText(/Menor Stat.*HP.*39.*charmander/)).toBeInTheDocument();
    });

    it('should identify most common type', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1, mockPokemon2],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      // Tipos: grass, poison, fire - cada um aparece uma vez, então deve pegar o primeiro
      expect(screen.getByText('grass')).toBeInTheDocument();
    });
  });

  describe('Local Storage Integration', () => {
    it('should save comparison to localStorage when modified', async () => {
      const store = createTestStore();
      
      renderWithStore(<ComparisonPage />, store);
      
      // Simular adição de Pokémon (dispatch diretamente para o teste)
      store.dispatch({
        type: 'comparison/addToComparison',
        payload: mockPokemon1,
      });
      
      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          'pokemon-app-comparison',
          JSON.stringify([mockPokemon1])
        );
      });
    });

    it('should load comparison from localStorage on initialization', () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockPokemon1]));
      
      const store = createTestStore();
      renderWithStore(<ComparisonPage />, store);
      
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('pokemon-app-comparison');
    });
  });

  describe('Navigation', () => {
    it('should navigate back to pokémon list when back button is clicked', () => {
      const store = createTestStore({
        comparison: {
          list: [mockPokemon1],
          isComparing: false,
          maxItems: 4,
          error: null,
        },
      });
      
      renderWithStore(<ComparisonPage />, store);
      
      const backButton = screen.getByLabelText('Voltar');
      fireEvent.click(backButton);
      
      expect(mockRoute).toHaveBeenCalledWith('/pokemon');
    });
  });
});
