import { createSlice } from '@reduxjs/toolkit';

/**
 * @typedef {import('../../types/index.js').Pokemon} Pokemon
 * @typedef {import('../../types/index.js').FavoritesState} FavoritesState
 */

const FAVORITES_STORAGE_KEY = 'pokemon-app-favorites';

/**
 * Carrega favoritos do localStorage
 * @returns {Array<Pokemon>} Lista de Pokémon favoritos
 */
const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    // console.error('Erro ao carregar favoritos do localStorage:', error);
    return [];
  }
};

/**
 * Salva favoritos no localStorage
 * @param {Array<Pokemon>} favorites Lista de Pokémon favoritos
 */
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    // console.error('Erro ao salvar favoritos no localStorage:', error);
  }
};

const initialState = {
  list: loadFavoritesFromStorage(),
  isLoading: false,
  error: null,
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action) => {
      const pokemon = action.payload;
      const exists = state.list.find(fav => fav.id === pokemon.id);
      
      if (!exists) {
        state.list.push(pokemon);
        saveFavoritesToStorage(state.list);
      }
    },
    
    removeFromFavorites: (state, action) => {
      const pokemonId = action.payload;
      state.list = state.list.filter(fav => fav.id !== pokemonId);
      saveFavoritesToStorage(state.list);
    },
    
    toggleFavorite: (state, action) => {
      const pokemon = action.payload;
      const existingIndex = state.list.findIndex(fav => fav.id === pokemon.id);
      
      if (existingIndex !== -1) {
        // Remove dos favoritos
        state.list.splice(existingIndex, 1);
      } else {
        // Adiciona aos favoritos
        state.list.push(pokemon);
      }
      
      saveFavoritesToStorage(state.list);
    },
    
    clearFavorites: (state) => {
      state.list = [];
      saveFavoritesToStorage([]);
    },
    
    setFavoritesLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    
    setFavoritesError: (state, action) => {
      state.error = action.payload;
    },
    
    // Sincroniza favoritos com o localStorage (útil em casos de inconsistência)
    syncFavoritesFromStorage: (state) => {
      state.list = loadFavoritesFromStorage();
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  setFavoritesLoading,
  setFavoritesError,
  syncFavoritesFromStorage,
} = favoritesSlice.actions;

// Seletores
export const selectFavorites = (state) => state.favorites.list;
export const selectFavoritesCount = (state) => state.favorites.list.length;
export const selectIsFavorite = (pokemonId) => (state) => 
  state.favorites.list.some(fav => fav.id === pokemonId);
export const selectFavoritesLoading = (state) => state.favorites.isLoading;
export const selectFavoritesError = (state) => state.favorites.error;

export default favoritesSlice.reducer;
