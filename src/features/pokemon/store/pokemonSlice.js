import { createSlice } from "@reduxjs/toolkit";

/**
 * @typedef {import('../../types/index.js').PokemonState} PokemonState
 * @typedef {import('../../types/index.js').PokemonListItem} PokemonListItem
 * @typedef {import('../../types/index.js').Pokemon} Pokemon
 * @typedef {import('../../types/index.js').PokemonFilters} PokemonFilters
 */

const initialState = {
  list: [],
  selected: null,
  filters: {
    search: "",
    type: "",
    sortBy: "id",
    sortOrder: "asc",
  },
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
  },
};

export const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {
    setPokemonList: (state, action) => {
      state.list = action.payload.map((pokemon) => {
        if (typeof pokemon === "object" && pokemon !== null) {
          if (pokemon.toInternal && typeof pokemon.toInternal === "function") {
            return pokemon.toInternal();
          }
          return JSON.parse(JSON.stringify(pokemon));
        }
        return pokemon;
      });
    },
    setSelectedPokemon: (state, action) => {
      if (action.payload) {
        if (
          typeof action.payload === "object" &&
          action.payload.toInternal &&
          typeof action.payload.toInternal === "function"
        ) {
          state.selected = action.payload.toInternal();
        } else {
          state.selected = JSON.parse(JSON.stringify(action.payload));
        }
      } else {
        state.selected = null;
      }
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    updatePokemonInList: (state, action) => {
      const index = state.list.findIndex((p) => p.name === action.payload.name);
      if (index !== -1) {
        state.list[index] = {
          ...state.list[index],
          ...action.payload,
        };
      }
    },
    clearPokemonList: (state) => {
      state.list = [];
    },
    clearSelectedPokemon: (state) => {
      state.selected = null;
    },
  },
});

export const {
  setPokemonList,
  setSelectedPokemon,
  setFilters,
  clearFilters,
  setLoading,
  setError,
  setPagination,
  updatePokemonInList,
  clearPokemonList,
  clearSelectedPokemon,
} = pokemonSlice.actions;

export default pokemonSlice.reducer;
