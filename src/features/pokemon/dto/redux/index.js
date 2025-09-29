/**
 * DTOs do Redux para a feature Pokemon
 * Contém DTOs para gerenciamento de estado relacionado aos Pokémon
 */

// Re-exporta DTOs de API necessários
import { PokemonDTO, PokemonListItemDTO } from '../api/index.js';

/**
 * DTO para estado do Pokemon no Redux
 */
export class PokemonStateDTO {
  constructor(data = {}) {
    this.list = (data.list || []).map(item => new PokemonListItemDTO(item));
    this.selected = data.selected ? new PokemonDTO(data.selected) : null;
    this.filters = new PokemonFiltersDTO(data.filters || {});
    this.isLoading = data.isLoading || false;
    this.error = data.error || null;
    this.pagination = new PaginationDTO(data.pagination || {});
    this.favorites = (data.favorites || []).map(item => new PokemonDTO(item));
    this.searchHistory = data.searchHistory || [];
  }

  /**
   * Obtém lista filtrada de Pokémon
   * @returns {Array<PokemonListItemDTO>}
   */
  getFilteredList() {
    let filtered = [...this.list];

    // Aplicar filtro de busca
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
      );
    }

    // Aplicar filtro de tipo
    if (this.filters.type) {
      filtered = filtered.filter(pokemon => 
        pokemon.primaryType === this.filters.type
      );
    }

    // Aplicar ordenação
    filtered.sort((a, b) => {
      const order = this.filters.sortOrder === 'desc' ? -1 : 1;
      const aValue = a[this.filters.sortBy] || '';
      const bValue = b[this.filters.sortBy] || '';
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return aValue.localeCompare(bValue) * order;
      }
      
      return (aValue - bValue) * order;
    });

    return filtered;
  }

  /**
   * Verifica se o Pokémon está nos favoritos
   * @param {number} pokemonId 
   * @returns {boolean}
   */
  isFavorite(pokemonId) {
    return this.favorites.some(fav => fav.id === pokemonId);
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      list: this.list.map(item => item.toPlainObject()),
      selected: this.selected ? this.selected.toPlainObject() : null,
      filters: this.filters.toPlainObject(),
      isLoading: this.isLoading,
      error: this.error,
      pagination: this.pagination.toPlainObject(),
      favorites: this.favorites.map(item => item.toPlainObject()),
      searchHistory: this.searchHistory
    };
  }
}

/**
 * DTO para filtros de Pokémon
 */
export class PokemonFiltersDTO {
  constructor(data = {}) {
    this.search = data.search || '';
    this.type = data.type || '';
    this.sortBy = data.sortBy || 'name';
    this.sortOrder = data.sortOrder || 'asc';
    this.generation = data.generation || '';
    this.rarity = data.rarity || '';
    this.minHeight = data.minHeight || null;
    this.maxHeight = data.maxHeight || null;
    this.minWeight = data.minWeight || null;
    this.maxWeight = data.maxWeight || null;
  }

  /**
   * Verifica se há filtros ativos
   * @returns {boolean}
   */
  hasActiveFilters() {
    return !!(
      this.search ||
      this.type ||
      this.generation ||
      this.rarity ||
      this.minHeight ||
      this.maxHeight ||
      this.minWeight ||
      this.maxWeight
    );
  }

  /**
   * Limpa todos os filtros
   */
  clear() {
    this.search = '';
    this.type = '';
    this.generation = '';
    this.rarity = '';
    this.minHeight = null;
    this.maxHeight = null;
    this.minWeight = null;
    this.maxWeight = null;
    this.sortBy = 'name';
    this.sortOrder = 'asc';
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      search: this.search,
      type: this.type,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      generation: this.generation,
      rarity: this.rarity,
      minHeight: this.minHeight,
      maxHeight: this.maxHeight,
      minWeight: this.minWeight,
      maxWeight: this.maxWeight
    };
  }
}

/**
 * DTO para paginação
 */
export class PaginationDTO {
  constructor(data = {}) {
    this.currentPage = data.currentPage || 1;
    this.totalPages = data.totalPages || 1;
    this.hasNext = data.hasNext || false;
    this.hasPrevious = data.hasPrevious || false;
    this.itemsPerPage = data.itemsPerPage || 20;
    this.totalItems = data.totalItems || 0;
  }

  /**
   * Calcula o offset baseado na página atual
   * @returns {number}
   */
  getOffset() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  /**
   * Verifica se é possível ir para próxima página
   * @returns {boolean}
   */
  canGoNext() {
    return this.hasNext && this.currentPage < this.totalPages;
  }

  /**
   * Verifica se é possível ir para página anterior
   * @returns {boolean}
   */
  canGoPrevious() {
    return this.hasPrevious && this.currentPage > 1;
  }

  /**
   * Obtém informações da página atual
   * @returns {Object}
   */
  getPageInfo() {
    const startItem = this.getOffset() + 1;
    const endItem = Math.min(startItem + this.itemsPerPage - 1, this.totalItems);
    
    return {
      startItem,
      endItem,
      totalItems: this.totalItems,
      currentPage: this.currentPage,
      totalPages: this.totalPages
    };
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      currentPage: this.currentPage,
      totalPages: this.totalPages,
      hasNext: this.hasNext,
      hasPrevious: this.hasPrevious,
      itemsPerPage: this.itemsPerPage,
      totalItems: this.totalItems
    };
  }
}

// Re-exporta DTOs necessários
export { PokemonDTO, PokemonListItemDTO };
