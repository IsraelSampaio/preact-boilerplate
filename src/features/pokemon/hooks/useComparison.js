import {
  useAppDispatch,
  useAppSelector,
} from "../../shared/hooks/useAppDispatch.js";
import {
  addToComparison,
  removeFromComparison,
  clearComparison,
  setComparing,
  setComparisonError,
  reorderComparison,
  syncComparisonFromStorage,
  selectComparisonList,
  selectComparisonCount,
  selectIsComparing,
  selectComparisonError,
  selectCanAddToComparison,
  selectMaxComparisonItems,
} from "../store/comparisonSlice.js";

/**
 * Hook personalizado para gerenciar comparação de Pokémon
 * @returns {Object} Objeto com estado e ações de comparação
 */
export const useComparison = () => {
  const dispatch = useAppDispatch();

  const comparisonList = useAppSelector(selectComparisonList);
  const comparisonCount = useAppSelector(selectComparisonCount);
  const isComparing = useAppSelector(selectIsComparing);
  const error = useAppSelector(selectComparisonError);
  const canAddToComparison = useAppSelector(selectCanAddToComparison);
  const maxItems = useAppSelector(selectMaxComparisonItems);

  /**
   * Adiciona um Pokémon à comparação
   * @param {Object} pokemon Dados do Pokémon
   * @returns {boolean} True se adicionado com sucesso
   */
  const addPokemonToComparison = (pokemon) => {
    dispatch(addToComparison(pokemon));
    return true;
  };

  /**
   * Remove um Pokémon da comparação
   * @param {number} pokemonId ID do Pokémon
   */
  const removePokemonFromComparison = (pokemonId) => {
    dispatch(removeFromComparison(pokemonId));
  };

  /**
   * Limpa toda a lista de comparação
   */
  const clearAllComparison = () => {
    dispatch(clearComparison());
  };

  /**
   * Define se está no modo comparação
   * @param {boolean} comparing Se está comparando
   */
  const setComparisonMode = (comparing) => {
    dispatch(setComparing(comparing));
  };

  /**
   * Define erro de comparação
   * @param {string|null} errorMessage Mensagem de erro
   */
  const setError = (errorMessage) => {
    dispatch(setComparisonError(errorMessage));
  };

  /**
   * Reordena itens na lista de comparação
   * @param {number} fromIndex Índice de origem
   * @param {number} toIndex Índice de destino
   */
  const reorderComparisonList = (fromIndex, toIndex) => {
    dispatch(reorderComparison({ fromIndex, toIndex }));
  };

  /**
   * Verifica se um Pokémon está na lista de comparação
   * @param {number} pokemonId ID do Pokémon
   * @returns {boolean} True se estiver na lista
   */
  const isInComparison = (pokemonId) => {
    return comparisonList.some((p) => p.id === pokemonId);
  };

  /**
   * Toggle um Pokémon na comparação (adiciona se não está, remove se está)
   * @param {Object} pokemon Dados do Pokémon
   * @returns {string} Ação realizada ('added', 'removed', 'error')
   */
  const togglePokemonComparison = (pokemon) => {
    if (isInComparison(pokemon.id)) {
      removePokemonFromComparison(pokemon.id);
      return "removed";
    } else {
      if (canAddToComparison) {
        addPokemonToComparison(pokemon);
        return "added";
      } else {
        return "error";
      }
    }
  };

  /**
   * Sincroniza com localStorage
   */
  const syncComparison = () => {
    dispatch(syncComparisonFromStorage());
  };

  /**
   * Obtém estatísticas da comparação
   * @returns {Object} Estatísticas calculadas
   */
  const getComparisonStats = () => {
    if (comparisonList.length === 0) return null;

    const stats = {
      averageHeight: 0,
      averageWeight: 0,
      averageBaseExperience: 0,
      mostCommonType: "",
      highestStat: { name: "", value: 0, pokemon: "" },
      lowestStat: { name: "", value: Infinity, pokemon: "" },
    };

    // Calcula médias
    const totalHeight = comparisonList.reduce(
      (sum, p) => sum + (p.height || 0),
      0,
    );
    const totalWeight = comparisonList.reduce(
      (sum, p) => sum + (p.weight || 0),
      0,
    );
    const totalBaseExp = comparisonList.reduce(
      (sum, p) => sum + (p.base_experience || 0),
      0,
    );

    stats.averageHeight = (totalHeight / comparisonList.length / 10).toFixed(1); // em metros
    stats.averageWeight = (totalWeight / comparisonList.length / 10).toFixed(1); // em kg
    stats.averageBaseExperience = Math.round(
      totalBaseExp / comparisonList.length,
    );

    // Tipo mais comum
    const typeCount = {};
    comparisonList.forEach((pokemon) => {
      pokemon.types?.forEach((type) => {
        const typeName = type.type.name;
        typeCount[typeName] = (typeCount[typeName] || 0) + 1;
      });
    });

    stats.mostCommonType = Object.keys(typeCount).reduce((a, b) =>
      typeCount[a] > typeCount[b] ? a : b,
    );

    // Maior e menor estatística
    comparisonList.forEach((pokemon) => {
      pokemon.stats?.forEach((stat) => {
        if (stat.base_stat > stats.highestStat.value) {
          stats.highestStat = {
            name: stat.stat.name,
            value: stat.base_stat,
            pokemon: pokemon.name,
          };
        }
        if (stat.base_stat < stats.lowestStat.value) {
          stats.lowestStat = {
            name: stat.stat.name,
            value: stat.base_stat,
            pokemon: pokemon.name,
          };
        }
      });
    });

    return stats;
  };

  return {
    // Estado
    comparisonList,
    comparisonCount,
    isComparing,
    error,
    canAddToComparison,
    maxItems,

    // Ações
    addPokemonToComparison,
    removePokemonFromComparison,
    clearAllComparison,
    setComparisonMode,
    setError,
    reorderComparisonList,
    syncComparison,

    // Utilities
    isInComparison,
    togglePokemonComparison,
    getComparisonStats,
  };
};
