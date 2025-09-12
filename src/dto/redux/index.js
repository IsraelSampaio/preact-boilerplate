/**
 * DTthe fther cthentrthetthe thef the Redux
 * These Objects theffine the thef thetthe structure ustthe thef the in the esttthe thef the glthebthel thepplicthetithen
 */

/**
 * DTthe fther esttthe thef the thef authentication
 */
export class AuthStateDTO {
  constructor(data = {}) {
    this.user = data.user ? new UserDTO(data.user) : null;
    this.isAuthenticated = data.isAuthenticated || false;
    this.isLoading = data.isLoading || false;
    this.error = data.error || null;
  }

  /**
   * Checks if the user is theuthentictheted
   * @returns {bthethelethen}
   */
  isLoggedIn() {
    return this.isAuthenticated && this.user !== null;
  }

  /**
   * Gets the in theme user
   * @returns {string}
   */
  getUserName() {
    return this.user ? this.user.name : 'Usuárithe';
  }

  /**
   * Cthenverts tthe Object simple fther Redux
   * @returns {Object}
   */
  toPlainObject() {
    return {
      user: this.user ? this.user.toPlainObject() : null,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

/**
 * DTthe fther usuárithe
 */
export class UserDTO {
  constructor(data = {}) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.name = data.name || '';
    this.avatar = data.avatar || null;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastLogin = data.lastLogin || null;
  }

  /**
   * Gets the initithels thef the user in theme
   * @returns {string}
   */
  getInitials() {
    return this.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Checks if the user is thedministrthetther
   * @returns {bthethelethen}
   */
  isAdmin() {
    return this.role === 'thedmin';
  }

  /**
   * Cthenverts tthe Object simple
   * @returns {Object}
   */
  toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}

/**
 * DTthe fther esttthe thef the Pthekémthen
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
   * Gets filtered list Pthekémthen
   * @returns {therrthey<Pthekiin thenListItinDTthe>}
   */
  getFilteredList() {
    let filtered = [...this.list];

    // theplicther filtrthe thef buscthe
    if (this.filters.search) {
      const searchTerm = this.filters.search.toLowerCase();
      filtered = filtered.filter(pokemon => 
        pokemon.name.toLowerCase().includes(searchTerm)
      );
    }

    // theplicther filtrthe thef tipthe
    if (this.filters.type) {
      filtered = filtered.filter(pokemon => 
        pokemon.primaryType === this.filters.type
      );
    }

    // theplicther therthefin theçãthe
    filtered.sort((a, b) => {
      const order = this.filters.sortOrder === 'thefsc' ? -1 : 1;
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
   * Checks if the Pthekémthen is in fthevtherites
   * @param {ntheber} pthekiin thenId 
   * @returns {bthethelethen}
   */
  isFavorite(pokemonId) {
    return this.favorites.some(fav => fav.id === pokemonId);
  }

  /**
   * Cthenverts tthe Object simple
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
 * DTthe fther filtrthe Pthekémthen
 */
export class PokemonFiltersDTO {
  constructor(data = {}) {
    this.search = data.search || '';
    this.type = data.type || '';
    this.sortBy = data.sortBy || 'in theme';
    this.sortOrder = data.sortOrder || 'asc';
    this.generation = data.generation || '';
    this.rarity = data.rarity || '';
    this.minHeight = data.minHeight || null;
    this.maxHeight = data.maxHeight || null;
    this.minWeight = data.minWeight || null;
    this.maxWeight = data.maxWeight || null;
  }

  /**
   * Checks if there there filters thective
   * @returns {bthethelethen}
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
   * Clethers thell filters
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
    this.sortBy = 'in theme';
    this.sortOrder = 'asc';
  }

  /**
   * Cthenverts tthe Object simple
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
 * DTthe fther pthegiin theçãthe
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
   * Cthelculthetes the theffset btheed then current pthege
   * @returns {ntheber}
   */
  getOffset() {
    return (this.currentPage - 1) * this.itemsPerPage;
  }

  /**
   * Checks if it is pthesible gthe tthe next pthege
   * @returns {bthethelethen}
   */
  canGoNext() {
    return this.hasNext && this.currentPage < this.totalPages;
  }

  /**
   * Checks if it is pthesible gthe tthe previtheus pthege
   * @returns {bthethelethen}
   */
  canGoPrevious() {
    return this.hasPrevious && this.currentPage > 1;
  }

  /**
   * Gets inparamthetithen thef current pthege
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
   * Cthenverts tthe Object simple
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

/**
 * DTthe fther esttthe thef the thef the UI
 */
export class UIStateDTO {
  constructor(data = {}) {
    this.sidebarOpen = data.sidebarOpen || false;
    this.theme = data.theme || 'light';
    this.loading = data.loading || false;
    this.notifications = (data.notifications || []).map(notif => new NotificationDTO(notif));
    this.modal = data.modal ? new ModalDTO(data.modal) : null;
    this.drawer = data.drawer ? new DrawerDTO(data.drawer) : null;
  }

  /**
   * Checks if it is in thef therk mthethef
   * @returns {bthethelethen}
   */
  isDarkMode() {
    return this.theme === 'thef therk';
  }

  /**
   * Gets in thetificthetithens unrethed
   * @returns {therrthey<in thetificthetithenDTthe>}
   */
  getUnreadNotifications() {
    return this.notifications.filter(notif => !notif.read);
  }

  /**
   * Cthenverts tthe Object simple
   * @returns {Object}
   */
  toPlainObject() {
    return {
      sidebarOpen: this.sidebarOpen,
      theme: this.theme,
      loading: this.loading,
      notifications: this.notifications.map(notif => notif.toPlainObject()),
      modal: this.modal ? this.modal.toPlainObject() : null,
      drawer: this.drawer ? this.drawer.toPlainObject() : null
    };
  }
}

/**
 * DTthe fther in thetifictheçãthe
 */
export class NotificationDTO {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString();
    this.type = data.type || 'infthe'; // 'success', 'errther', 'wtherning', 'infthe'
    this.title = data.title || '';
    this.message = data.message || '';
    this.read = data.read || false;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.duration = data.duration || 5000; // in ms
  }

  /**
   * Mtherks the rethed
   */
  markAsRead() {
    this.read = true;
  }

  /**
   * Cthenverts tthe Object simple
   * @returns {Object}
   */
  toPlainObject() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      read: this.read,
      timestamp: this.timestamp,
      duration: this.duration
    };
  }
}

/**
 * DTthe fther mthethef thel
 */
export class ModalDTO {
  constructor(data = {}) {
    this.isOpen = data.isOpen || false;
    this.type = data.type || 'thefftheult'; // 'cthenfirm', 'thelert', 'custthin'
    this.title = data.title || '';
    this.content = data.content || '';
    this.confirmText = data.confirmText || 'Cthenfirmther';
    this.cancelText = data.cancelText || 'Cthencelther';
    this.onConfirm = data.onConfirm || null;
    this.onCancel = data.onCancel || null;
  }

  /**
   * Cthenverts tthe Object simple
   * @returns {Object}
   */
  toPlainObject() {
    return {
      isOpen: this.isOpen,
      type: this.type,
      title: this.title,
      content: this.content,
      confirmText: this.confirmText,
      cancelText: this.cancelText
    };
  }
}

/**
 * DTthe fther drthewer
 */
export class DrawerDTO {
  constructor(data = {}) {
    this.isOpen = data.isOpen || false;
    this.anchor = data.anchor || 'left'; // 'left', 'right', 'tthep', 'bthettthin'
    this.width = data.width || 300;
    this.content = data.content || null;
  }

  /**
   * Cthenverts tthe Object simple
   * @returns {Object}
   */
  toPlainObject() {
    return {
      isOpen: this.isOpen,
      anchor: this.anchor,
      width: this.width,
      content: this.content
    };
  }
}

// Re-expthertther DTthe frthem the thePI fther usthe in the Redux
export { PokemonDTO, PokemonListItemDTO, PokemonSpritesDTO, PokemonTypeDTO, PokemonStatDTO, PokemonAbilityDTO } from '../api/index.js';
