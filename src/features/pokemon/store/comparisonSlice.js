import { createSlice } from "@reduxjs/toolkit";

/**
 * @typedef {import('../../types/index.js').Pokemon} Pokemon
 * @typedef {import('../../types/index.js').ComparisonState} ComparisonState
 */

const COMPARISON_STORAGE_KEY = "pokemon-app-comparison";
const MAX_COMPARISON_ITEMS = 4; // Máximo de Pokémon para comparar

/**
 * Carrega lista de comparação do localStorage
 * @returns {Array<Pokemon>} Lista de Pokémon para comparação
 */
const loadComparisonFromStorage = () => {
  try {
    const stored = localStorage.getItem(COMPARISON_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    // console.error('Erro ao carregar comparação do localStorage:', error);
    return [];
  }
};

/**
 * Salva lista de comparação no localStorage
 * @param {Array<Pokemon>} comparisonList Lista de Pokémon para comparação
 */
const saveComparisonToStorage = (comparisonList) => {
  try {
    localStorage.setItem(
      COMPARISON_STORAGE_KEY,
      JSON.stringify(comparisonList),
    );
  } catch (error) {
    // console.error('Erro ao salvar comparação no localStorage:', error);
  }
};

const initialState = {
  list: loadComparisonFromStorage(),
  isComparing: false,
  maxItems: MAX_COMPARISON_ITEMS,
  error: null,
};

export const comparisonSlice = createSlice({
  name: "comparison",
  initialState,
  reducers: {
    addToComparison: (state, action) => {
      const pokemon = action.payload;

      // Verifica se já existe na lista
      const exists = state.list.find((p) => p.id === pokemon.id);
      if (exists) {
        state.error = "Este Pokémon já está na lista de comparação";
        return;
      }

      // Verifica limite máximo
      if (state.list.length >= state.maxItems) {
        state.error = `Máximo de ${state.maxItems} Pokémon podem ser comparados`;
        return;
      }

      state.list.push(pokemon);
      state.error = null;
      saveComparisonToStorage(state.list);
    },

    removeFromComparison: (state, action) => {
      const pokemonId = action.payload;
      state.list = state.list.filter((p) => p.id !== pokemonId);
      state.error = null;
      saveComparisonToStorage(state.list);
    },

    clearComparison: (state) => {
      state.list = [];
      state.error = null;
      saveComparisonToStorage([]);
    },

    setComparing: (state, action) => {
      state.isComparing = action.payload;
    },

    setComparisonError: (state, action) => {
      state.error = action.payload;
    },

    reorderComparison: (state, action) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedItem] = state.list.splice(fromIndex, 1);
      state.list.splice(toIndex, 0, movedItem);
      saveComparisonToStorage(state.list);
    },

    // Sincroniza com localStorage
    syncComparisonFromStorage: (state) => {
      state.list = loadComparisonFromStorage();
    },
  },
});

export const {
  addToComparison,
  removeFromComparison,
  clearComparison,
  setComparing,
  setComparisonError,
  reorderComparison,
  syncComparisonFromStorage,
} = comparisonSlice.actions;

// Seletores
export const selectComparisonList = (state) => state.comparison.list;
export const selectComparisonCount = (state) => state.comparison.list.length;
export const selectIsInComparison = (pokemonId) => (state) =>
  state.comparison.list.some((p) => p.id === pokemonId);
export const selectIsComparing = (state) => state.comparison.isComparing;
export const selectComparisonError = (state) => state.comparison.error;
export const selectCanAddToComparison = (state) =>
  state.comparison.list.length < state.comparison.maxItems;
export const selectMaxComparisonItems = (state) => state.comparison.maxItems;

export default comparisonSlice.reducer;
