import { useAppDispatch, useAppSelector } from '../../shared/hooks/useAppDispatch.js';
import {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  selectFavorites,
  selectFavoritesCount,
  selectIsFavorite,
  selectFavoritesLoading,
  selectFavoritesError,
  syncFavoritesFromStorage,
} from '../store/favoritesSlice.js';

/**
 * Hook personalizado para gerenciar favoritos
 * @returns {Object} Objete com estado e ações dos favoritos
 */
export const useFavorites = () => {
  const dispatch = useAppDispatch();
  
  const favorites = useAppSelector(selectFavorites);
  const favoritesCount = useAppSelector(selectFavoritesCount);
  const isLoading = useAppSelector(selectFavoritesLoading);
  const error = useAppSelector(selectFavoritesError);

  /**
   * Adiciona um Pokémon aos favoritos
   * @param {Object} pokemon Dados do Pokémon
   */
  const addFavorite = (pokemon) => {
    dispatch(addToFavorites(pokemon));
  };

  /**
   * Remove um Pokémon dos favoritos
   * @param {number} pokemonId ID do Pokémon
   */
  const removeFavorite = (pokemonId) => {
    dispatch(removeFromFavorites(pokemonId));
  };

  /**
   * Alterna o status de favorito de um Pokémon
   * @param {Object} pokemon Dados do Pokémon
   */
  const togglePokemonFavorite = (pokemon) => {
    dispatch(toggleFavorite(pokemon));
  };

  /**
   * Remove todos os favoritos
   */
  const clearAllFavorites = () => {
    dispatch(clearFavorites());
  };

  /**
   * Verifica se um Pokémon é favorito
   * @param {number} pokemonId ID do Pokémon
   * @returns {boolean} True se for favorito
   */
  const isFavorite = (pokemonId) => {
    return favorites.some(fav => fav.id === pokemonId);
  };

  /**
   * Sincroniza favoritos com localStorage
   */
  const syncFavorites = () => {
    dispatch(syncFavoritesFromStorage());
  };

  /**
   * Filtra favoritos por critério
   * @param {Function} filterFn Função de filtro
   * @returns {Array} Lista filtrada de favoritos
   */
  const filterFavorites = (filterFn) => {
    return favorites.filter(filterFn);
  };

  /**
   * Busca favoritos por nome
   * @param {string} query Termo de busca
   * @returns {Array} Lista de favoritos filtrada
   */
  const searchFavorites = (query) => {
    if (!query) return favorites;
    
    return favorites.filter(pokemon =>
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  /**
   * Ordena favoritos
   * @param {string} sortBy Campo para ordenação ('name', 'id', 'type')
   * @param {string} order Ordem ('asc' ou 'desc')
   * @returns {Array} Lista ordenada de favoritos
   */
  const sortFavorites = (sortBy = 'name', order = 'asc') => {
    const sorted = [...favorites].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'id':
          aValue = a.id;
          bValue = b.id;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'type':
          aValue = a.primaryType || a.types[0]?.type.name || '';
          bValue = b.primaryType || b.types[0]?.type.name || '';
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }
      
      if (order === 'desc') {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    });
    
    return sorted;
  };

  return {
    // Estado
    favorites,
    favoritesCount,
    isLoading,
    error,
    
    // Ações
    addFavorite,
    removeFavorite,
    togglePokemonFavorite,
    clearAllFavorites,
    syncFavorites,
    
    // Utilities
    isFavorite,
    filterFavorites,
    searchFavorites,
    sortFavorites,
  };
};
