import { render, screen, fireEvent, waitFor } from "@testing-library/preact";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "@/store/slices/authSlice.js";
import { pokemonSlice } from "@/store/slices/pokemonSlice.js";
import { uiSlice } from "@/store/slices/uiSlice.js";
import { favoritesSlice } from "@/store/slices/favoritesSlice.js";
import { FavoritesPage } from "@/features/pokemon/pages/FavoritesPage.jsx";

// Mock de localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock dados de Pokémon para teste
const mockPokemon = [
  {
    id: 1,
    name: "bulbasaur",
    height: 7,
    weight: 69,
    base_experience: 64,
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png",
    },
    types: [
      {
        slot: 1,
        type: {
          name: "grass",
          url: "https://pokeapi.co/api/v2/type/12/",
        },
      },
    ],
    stats: [
      { base_stat: 45, stat: { name: "hp" } },
      { base_stat: 49, stat: { name: "attack" } },
      { base_stat: 49, stat: { name: "defense" } },
      { base_stat: 65, stat: { name: "special-attack" } },
      { base_stat: 65, stat: { name: "special-defense" } },
      { base_stat: 45, stat: { name: "speed" } },
    ],
  },
  {
    id: 2,
    name: "ivysaur",
    height: 10,
    weight: 130,
    base_experience: 142,
    sprites: {
      front_default:
        "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png",
    },
    types: [
      {
        slot: 1,
        type: {
          name: "grass",
          url: "https://pokeapi.co/api/v2/type/12/",
        },
      },
    ],
    stats: [
      { base_stat: 60, stat: { name: "hp" } },
      { base_stat: 62, stat: { name: "attack" } },
      { base_stat: 63, stat: { name: "defense" } },
      { base_stat: 80, stat: { name: "special-attack" } },
      { base_stat: 80, stat: { name: "special-defense" } },
      { base_stat: 60, stat: { name: "speed" } },
    ],
  },
];

// Mock do router
vi.mock("preact-router", () => ({
  route: vi.fn(),
}));

// Mock do i18n
vi.mock("@/hooks/useTranslation.js", () => ({
  useTranslation: () => ({
    t: (key, options = {}) => {
      const translations = {
        "favorites.title": "Meus Pokémon Favoritos",
        "favorites.subtitle": `Você tem ${
          options.count || 0
        } Pokémon favoritos.`,
        "favorites.subtitle_zero":
          "Você ainda não tem nenhum Pokémon favorito.",
        "favorites.empty.title": "🤔 Nenhum favorito ainda",
        "favorites.empty.description":
          "Explore a Pokédex e adicione seus Pokémon favoritos clicando no ícone de coração!",
        "favorites.empty.button": "Explorar Pokémon",
        "favorites.actions.clear": "Limpar todos",
        "favorites.actions.clearConfirm": "Limpar todos os favoritos?",
        "favorites.actions.clearDescription": `Esta ação removerá todos os ${
          options.count || 0
        } Pokémon dos seus favoritos. Esta ação não pode ser desfeita.`,
        "favorites.actions.clearButton": "Sim, limpar todos",
        "favorites.search.placeholder": "Buscar nos favoritos...",
        "favorites.search.noResults":
          "Nenhum favorito encontrado com os filtros aplicados.",
        "actions.cancel": "Cancelar",
        "pokemon.filters.sortBy": "Ordenar por",
        "pokemon.filters.name": "Nome",
        "pokemon.filters.id": "Número",
        "pokemon.filters.type": "Tipo",
        "pokemon.filters.asc": "Crescente",
        "pokemon.filters.desc": "Decrescente",
      };
      return translations[key] || key;
    },
  }),
}));

// Mock do MainLayout
vi.mock("@/components/layout.js", () => ({
  MainLayout: ({ children, title }) => (
    <div data-testid="main-layout" data-title={title}>
      {children}
    </div>
  ),
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
      favorites: favoritesSlice.reducer,
    },
    preloadedState: {
      auth: { user: { name: "Test User" }, isAuthenticated: true },
      pokemon: { list: [], selected: null, isLoading: false, error: null },
      ui: { theme: "light" },
      favorites: { list: [], isLoading: false, error: null },
      ...initialState,
    },
  });
};

/**
 * Função auxiliar para renderizar com Provider
 */
const renderWithStore = (component, store) => {
  return render(<Provider store={store}>{component}</Provider>);
};

describe("Favorites Integration Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("Empty Favorites State", () => {
    it("should display empty state when no favorites exist", () => {
      const store = createTestStore();

      renderWithStore(<FavoritesPage />, store);

      expect(screen.getByText("Meus Pokémon Favoritos")).toBeInTheDocument();
      expect(
        screen.getByText("Você ainda não tem nenhum Pokémon favorito."),
      ).toBeInTheDocument();
      expect(screen.getByText("🤔 Nenhum favorito ainda")).toBeInTheDocument();
      expect(screen.getByText("Explorar Pokémon")).toBeInTheDocument();
    });

    it("should redirect to pokemon list when clicking explore button", () => {
      const store = createTestStore();

      renderWithStore(<FavoritesPage />, store);

      const exploreButton = screen.getByText("Explorar Pokémon");
      fireEvent.click(exploreButton);

      // Verificar se o botão tem o href correto
      expect(exploreButton.closest("button")).toHaveAttribute(
        "href",
        "/pokemon",
      );
    });
  });

  describe("Favorites with Data", () => {
    it("should display favorites list when data exists", () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      expect(
        screen.getByText("Você tem 2 Pokémon favoritos."),
      ).toBeInTheDocument();
      expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
      expect(screen.getByText("Ivysaur")).toBeInTheDocument();
    });

    it("should show search controls when favorites exist", () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      expect(
        screen.getByPlaceholderText("Buscar nos favoritos..."),
      ).toBeInTheDocument();
      expect(screen.getByText("Ordenar por")).toBeInTheDocument();
      expect(screen.getByText("Limpar todos")).toBeInTheDocument();
    });

    it("should filter favorites by search query", async () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      const searchInput = screen.getByPlaceholderText(
        "Buscar nos favoritos...",
      );
      fireEvent.change(searchInput, { target: { value: "bulbasaur" } });

      await waitFor(() => {
        expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
        expect(screen.queryByText("Ivysaur")).not.toBeInTheDocument();
      });
    });

    it("should sort favorites by different criteria", async () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      // Verificar ordenação por ID
      const sortSelect = screen.getByDisplayValue("name");
      fireEvent.mouseDown(sortSelect);

      const idOption = screen.getByText("Número");
      fireEvent.click(idOption);

      await waitFor(() => {
        const pokemonCards = screen.getAllByTestId(/pokemon-card/);
        expect(pokemonCards[0]).toHaveTextContent("Bulbasaur");
        expect(pokemonCards[1]).toHaveTextContent("Ivysaur");
      });
    });

    it("should open clear confirmation dialog", () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      const clearButton = screen.getByText("Limpar todos");
      fireEvent.click(clearButton);

      expect(
        screen.getByText("Limpar todos os favoritos?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(
          "Esta ação removerá todos os 2 Pokémon dos seus favoritos. Esta ação não pode ser desfeita.",
        ),
      ).toBeInTheDocument();
    });

    it("should clear all favorites when confirmed", async () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      // Abrir dialog de confirmação
      const clearButton = screen.getByText("Limpar todos");
      fireEvent.click(clearButton);

      // Confirmar limpeza
      const confirmButton = screen.getByText("Sim, limpar todos");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        // Verificar se a ação foi disparada no store
        const state = store.getState();
        expect(state.favorites.list).toHaveLength(0);
      });
    });

    it("should cancel clear action when user cancels", () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      // Abrir dialog de confirmação
      const clearButton = screen.getByText("Limpar todos");
      fireEvent.click(clearButton);

      // Cancelar
      const cancelButton = screen.getByText("Cancelar");
      fireEvent.click(cancelButton);

      // Dialog deve fechar
      expect(
        screen.queryByText("Limpar todos os favoritos?"),
      ).not.toBeInTheDocument();

      // Favoritos devem permanecer
      const state = store.getState();
      expect(state.favorites.list).toHaveLength(2);
    });
  });

  describe("Local Storage Integration", () => {
    it("should load favorites from localStorage on initialization", () => {
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockPokemon));

      const store = createTestStore();
      renderWithStore(<FavoritesPage />, store);

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith(
        "pokemon-app-favorites",
      );
    });

    it("should save favorites to localStorage when modified", async () => {
      const store = createTestStore({
        favorites: {
          list: [mockPokemon[0]],
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      // Simular adição de favorito (dispatch diretamente para o teste)
      store.dispatch({
        type: "favorites/addToFavorites",
        payload: mockPokemon[1],
      });

      await waitFor(() => {
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
          "pokemon-app-favorites",
          JSON.stringify([mockPokemon[0], mockPokemon[1]]),
        );
      });
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels and roles", () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      // Verificar elementos de busca
      const searchInput = screen.getByPlaceholderText(
        "Buscar nos favoritos...",
      );
      expect(searchInput).toHaveAttribute("aria-label", "search");

      // Verificar botões
      const clearButton = screen.getByText("Limpar todos");
      expect(clearButton).toHaveAttribute("role", "button");
    });

    it("should support keyboard navigation", () => {
      const store = createTestStore({
        favorites: {
          list: mockPokemon,
          isLoading: false,
          error: null,
        },
      });

      renderWithStore(<FavoritesPage />, store);

      const searchInput = screen.getByPlaceholderText(
        "Buscar nos favoritos...",
      );

      // Teste de navegação por teclado
      fireEvent.keyDown(searchInput, { key: "Tab" });
      fireEvent.keyDown(searchInput, { key: "Enter" });

      // Verificar se elementos são focáveis
      expect(searchInput).toHaveAttribute("tabindex", "0");
    });
  });
});
