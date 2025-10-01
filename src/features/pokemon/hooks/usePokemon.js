import { useCallback, useEffect } from "preact/hooks";
import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/useAppDispatch.js";
import {
  setPokemonList,
  setSelectedPokemon,
  setFilters,
  setLoading,
  setError,
  setPagination,
} from "../store/pokemonSlice.js";
import { PokemonApiService } from "../services/pokemonApi.js";
import { ApiErrorDTO } from "../../auth/dto/api/index.js";

/**
 * @typedef {import('../types/index.js').PokemonFilters} PokemonFilters
 */

export const usePokemon = () => {
  const dispatch = useAppDispatch();
  const { list, selected, filters, isLoading, error, pagination } =
    useAppSelector((state) => state.pokemon);

  /**
   * @param {number} page
   * @param {number} limit
   */
  const fetchPokemonList = useCallback(
    async (page = 1, limit = 20) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const offset = (page - 1) * limit;
        const response = await PokemonApiService.getPokemonList(offset, limit);

        const internalData = response.toInternal();

        dispatch(setPokemonList(internalData.results));
        dispatch(
          setPagination({
            currentPage: page,
            totalPages: Math.ceil(internalData.count / limit),
            hasNext: !!internalData.next,
            hasPrevious: !!internalData.previous,
          }),
        );
      } catch (error) {
        let errorMessage = "Erro ao carregar lista de Pokémon";

        if (error instanceof ApiErrorDTO) {
          errorMessage = error.message;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }

        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /**
   * @param {number} id
   */
  const fetchPokemonById = useCallback(
    async (id) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const pokemon = await PokemonApiService.getPokemonById(id);
        const serializablePokemon = pokemon.toInternal
          ? pokemon.toInternal()
          : pokemon;
        dispatch(setSelectedPokemon(serializablePokemon));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao carregar Pokémon";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /**
   * @param {string} name
   */
  const fetchPokemonByName = useCallback(
    async (name) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const pokemon = await PokemonApiService.getPokemonByName(name);
        const serializablePokemon = pokemon.toInternal
          ? pokemon.toInternal()
          : pokemon;
        dispatch(setSelectedPokemon(serializablePokemon));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao carregar Pokémon";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  /**
   * @param {string} query
   */
  const searchPokemon = useCallback(
    async (query) => {
      if (!query.trim()) {
        await fetchPokemonList();
        return;
      }

      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        const results = await PokemonApiService.searchPokemon(query);
        const serializableResults = results.map((pokemon) =>
          pokemon.toInternal(),
        );
        dispatch(setPokemonList(serializableResults));
        dispatch(
          setPagination({
            currentPage: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          }),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao buscar Pokémon";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, fetchPokemonList],
  );

  /**
   * Ordena lista de Pokémon
   * @param {Array} pokemonList
   * @param {string} sortBy
   * @param {string} sortOrder
   * @returns {Array}
   */
  const sortPokemonList = useCallback((pokemonList, sortBy, sortOrder) => {
    return [...pokemonList].sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "id":
          aValue = a.id || 0;
          bValue = b.id || 0;
          break;
        case "height":
          aValue = a.heightInMeters || a.height || 0;
          bValue = b.heightInMeters || b.height || 0;
          break;
        case "weight":
          aValue = a.weightInKg || a.weight || 0;
          bValue = b.weightInKg || b.weight || 0;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (sortOrder === "desc") {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      } else {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      }
    });
  }, []);

  /**
   * Aplica filtros e ordenação
   * @param {PokemonFilters} currentFilters
   */
  const applyFilters = useCallback(
    async (currentFilters) => {
      dispatch(setLoading(true));
      dispatch(setError(null));

      try {
        let results = [];

        if (currentFilters.search && currentFilters.search.trim()) {
          results = await PokemonApiService.searchPokemon(
            currentFilters.search,
          );
          results = results.map((pokemon) => pokemon.toInternal());

          // Nota: Se também há filtro por tipo, a busca por texto tem prioridade
          // pois é mais específica. O usuário pode refinar a busca se necessário.
        } else if (currentFilters.type) {
          const typeResults = await PokemonApiService.getPokemonByType(
            currentFilters.type,
            0,
            100,
          );
          results = typeResults.results.map((pokemon) => pokemon.toInternal());
        } else {
          const listResults = await PokemonApiService.getPokemonList(0, 100);
          results = listResults.results.map((pokemon) => pokemon.toInternal());
        }
        const sortedResults = sortPokemonList(
          results,
          currentFilters.sortBy,
          currentFilters.sortOrder,
        );

        dispatch(setPokemonList(sortedResults));
        dispatch(
          setPagination({
            currentPage: 1,
            totalPages: 1,
            hasNext: false,
            hasPrevious: false,
          }),
        );
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Erro ao aplicar filtros";
        dispatch(setError(errorMessage));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch, sortPokemonList],
  );

  /**
   * @param {Partial<PokemonFilters>} newFilters
   */
  const updateFilters = useCallback(
    (newFilters) => {
      dispatch(setFilters(newFilters));
    },
    [dispatch],
  );

  /**
   * Aplica os filtros atuais
   */
  const applyCurrentFilters = useCallback(() => {
    applyFilters(filters);
  }, [applyFilters, filters]);

  const clearSelectedPokemon = useCallback(() => {
    dispatch(setSelectedPokemon(null));
  }, [dispatch]);

  useEffect(() => {
    // Só carrega a lista se ela estiver vazia
    if (list.length === 0 && !isLoading) {
      fetchPokemonList();
    }
  }, [list.length, isLoading]); // eslint-disable-line react-hooks/exhaustive-deps

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
    applyCurrentFilters,
    applyFilters,
    clearSelectedPokemon,
  };
};
