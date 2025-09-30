import { useCallback, useEffect } from 'preact/hooks';
import { useAppDispatch, useAppSelector } from '../../shared/hooks/useAppDispatch.js';
import {
  setPokemonList,
  setSelectedPokemon,
  setFilters,
  setLoading,
  setError,
  setPagination,
} from '../store/pokemonSlice.js';
import { PokemonApiService } from '../services/pokemonApi.js';
import { ApiErrorDTO } from '../../auth/dto/api/index.js';

/**
 * @typedef {import('../types/index.js').PokemonFilters} PokemonFilters
 */

export const usePokemon = () => {
  const dispatch = useAppDispatch();
  const { list, selected, filters, isLoading, error, pagination } = useAppSelector(
    (state) => state.pokemon
  );

  /**
   * @param {number} page 
   * @param {number} limit 
   */
  const fetchPokemonList = useCallback(async (page = 1, limit = 20) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const offset = (page - 1) * limit;
      const response = await PokemonApiService.getPokemonList(offset, limit);
      
      // Converter DTO para formato interno
      const internalData = response.toInternal();
      
      dispatch(setPokemonList(internalData.results));
      dispatch(setPagination({
        currentPage: page,
        totalPages: Math.ceil(internalData.count / limit),
        hasNext: !!internalData.next,
        hasPrevious: !!internalData.previous,
      }));
    } catch (error) {
      let errorMessage = 'Erro ao carregar Pokémon';
      
      if (error instanceof ApiErrorDTO) {
        errorMessage = error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * @param {number} id 
   */
  const fetchPokemonById = useCallback(async (id) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const pokemon = await PokemonApiService.getPokemonById(id);
      // Garantir que o DTO seja convertido para formato serializável
      const serializablePokemon = pokemon.toInternal ? pokemon.toInternal() : pokemon;
      dispatch(setSelectedPokemon(serializablePokemon));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar Pokémon';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * @param {string} name 
   */
  const fetchPokemonByName = useCallback(async (name) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const pokemon = await PokemonApiService.getPokemonByName(name);
      // Garantir que o DTO seja convertido para formato serializável
      const serializablePokemon = pokemon.toInternal ? pokemon.toInternal() : pokemon;
      dispatch(setSelectedPokemon(serializablePokemon));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar Pokémon';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  /**
   * @param {string} query 
   */
  const searchPokemon = useCallback(async (query) => {
    if (!query.trim()) {
      await fetchPokemonList();
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const results = await PokemonApiService.searchPokemon(query);
      // Garantir que os resultados sejam serializáveis
      const serializableResults = results.map(pokemon => 
        pokemon.toInternal ? pokemon.toInternal() : pokemon
      );
      dispatch(setPokemonList(serializableResults));
      dispatch(setPagination({
        currentPage: 1,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao buscar Pokémon';
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch, fetchPokemonList]);

  /**
   * @param {Partial<PokemonFilters>} newFilters 
   */
  const updateFilters = useCallback((newFilters) => {
    dispatch(setFilters(newFilters));
  }, [dispatch]);

  const clearSelectedPokemon = useCallback(() => {
    dispatch(setSelectedPokemon(null));
  }, [dispatch]);

  // Carregar lista inicial
  useEffect(() => {
    fetchPokemonList();
  }, [fetchPokemonList]);

  return {
    pokemonList: list,
    selectedPokemon: selected,
    filters,
    isLoading,
    error,
    pagination,
    fetchPokemonList,
    fetchPokemonById,
    fetchPokemonByName,
    searchPokemon,
    updateFilters,
    clearSelectedPokemon,
  };
};