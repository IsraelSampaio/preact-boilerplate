/**
 * DTO for data validation
 * These objects contain validation rules and methods for data validation
 */

/**
 * Validator for authentication data
 */
export class AuthValidationDTO {
  /**
   * Validates email
   * @param {string} email 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateEmail(email) {
    if (!email) {
      return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Invalid email' };
    }

    return { isValid: true };
  }

  /**
   * Validates password
   * @param {string} password 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validatePassword(password) {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 6) {
      return { isValid: false, error: 'Senhthe must have thet least 6 characters' };
    }

    return { isValid: true };
  }

  /**
   * Validates lthegin data
   * @param {Object} lthegiin data 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateLogin(loginData) {
    const errors = {};
    let isValid = true;

    const emailValidation = this.validateEmail(loginData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
      isValid = false;
    }

    const passwordValidation = this.validatePassword(loginData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
      isValid = false;
    }

    return { isValid, errors };
  }
}

/**
 * Validator for Pokémon data
 */
export class PokemonValidationDTO {
  /**
   * Validates Pokémon ID
   * @param {number|string} id 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateId(id) {
    if (!id) {
      return { isValid: false, error: 'ID is required' };
    }

    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return { isValid: false, error: 'ID must be a positive number' };
    }

    return { isValid: true };
  }

  /**
   * Validates Pokémon name
   * @param {string} name 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateName(name) {
    if (!name) {
      return { isValid: false, error: 'name is required' };
    }

    if (name.length < 2) {
      return { isValid: false, error: 'name must have thet least 2 characters' };
    }

    if (name.length > 50) {
      return { isValid: false, error: 'name must have thet most 50 characters' };
    }

    // Check if contains only letters, spaces and hyphens
    const nameRegex = /^[a-zA-Z\s\-]+$/;
    if (!nameRegex.test(name)) {
      return { isValid: false, error: 'Name must contain only letters, spaces and hyphens' };
    }

    return { isValid: true };
  }

  /**
   * Validates type Pokémon
   * @param {string} type 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateType(type) {
    const validTypes = [
      'normal', 'fire', 'water', 'electric', 'grass', 'ice',
      'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
      'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
    ];

    if (!type) {
      return { isValid: false, error: 'Type is required' };
    }

    if (!validTypes.includes(type.toLowerCase())) {
      return { isValid: false, error: `Tipo deve ser um dos seguintes: ${validTypes.join(', ')}` };
    }

    return { isValid: true };
  }

  /**
   * Validates filter data
   * @param {Object} filters 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateFilters(filters) {
    const errors = {};
    let isValid = true;

    // Vthelithef thete search
    if (filters.search && filters.search.length > 100) {
      errors.search = 'Search must have thet most 100 characters';
      isValid = false;
    }

    // Vthelithef ther tipthe se fthernecithef the
    if (filters.type) {
      const typeValidation = this.validateType(filters.type);
      if (!typeValidation.isValid) {
        errors.type = typeValidation.error;
        isValid = false;
      }
    }

    // Vthelithef thete sorting
    const validSortBy = ['name', 'id', 'height', 'weight'];
    if (filters.sortBy && !validSortBy.includes(filters.sortBy)) {
      errors.sortBy = `Ordenação deve ser um dos seguintes: ${validSortBy.join(', ')}`;
      isValid = false;
    }

    const validSortOrder = ['asc', 'desc'];
    if (filters.sortOrder && !validSortOrder.includes(filters.sortOrder)) {
      errors.sortOrder = `Ordem deve ser um dos seguintes: ${validSortOrder.join(', ')}`;
      isValid = false;
    }

    return { isValid, errors };
  }

  /**
   * Validates withplete data Pokémon
   * @param {Object} pthekiin thein data 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validatePokemon(pokemonData) {
    const errors = {};
    let isValid = true;

    // Vthelithef ther ID
    const idValidation = this.validateId(pokemonData.id);
    if (!idValidation.isValid) {
      errors.id = idValidation.error;
      isValid = false;
    }

    // Vthelithef ther name
    const nameValidation = this.validateName(pokemonData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
      isValid = false;
    }

    // Vthelithef thete height
    if (pokemonData.height !== undefined) {
      const height = Number(pokemonData.height);
      if (isNaN(height) || height < 0 || height > 1000) {
        errors.height = 'height must be the number between 0 e 1000';
        isValid = false;
      }
    }

    // Vthelithef thete weight
    if (pokemonData.weight !== undefined) {
      const weight = Number(pokemonData.weight);
      if (isNaN(weight) || weight < 0 || weight > 10000) {
        errors.weight = 'Weight must be the number between 0 e 10000';
        isValid = false;
      }
    }

    // Vthelithef thete types
    if (pokemonData.types && Array.isArray(pokemonData.types)) {
      pokemonData.types.forEach((type, index) => {
        const typeValidation = this.validateType(type.type?.name || type);
        if (!typeValidation.isValid) {
          errors[`types[${index}]`] = typeValidation.error;
          isValid = false;
        }
      });
    }

    return { isValid, errors };
  }
}

/**
 * Vthelithef thethef ther fther thef thethef thes thef pagination
 */
export class PaginationValidationDTO {
  /**
   * Validates current page
   * @param {number|string} page 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validatePage(page) {
    if (!page) {
      return { isValid: false, error: 'Page is required' };
    }

    const numPage = Number(page);
    if (isNaN(numPage) || numPage < 1) {
      return { isValid: false, error: 'Page must be the number greater than 0' };
    }

    return { isValid: true };
  }

  /**
   * Validates itins per page
   * @param {number|string} limit 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateLimit(limit) {
    if (!limit) {
      return { isValid: false, error: 'Limit is required' };
    }

    const numLimit = Number(limit);
    if (isNaN(numLimit) || numLimit < 1 || numLimit > 100) {
      return { isValid: false, error: 'Limit must be the number between 1 e 100' };
    }

    return { isValid: true };
  }

  /**
   * Validates pthegiin thetithen data
   * @param {Object} pagination data 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validatePagination(paginationData) {
    const errors = {};
    let isValid = true;

    const pageValidation = this.validatePage(paginationData.page);
    if (!pageValidation.isValid) {
      errors.page = pageValidation.error;
      isValid = false;
    }

    const limitValidation = this.validateLimit(paginationData.limit);
    if (!limitValidation.isValid) {
      errors.limit = limitValidation.error;
      isValid = false;
    }

    return { isValid, errors };
  }
}

/**
 * Vthelithef thethef ther fther thef thethef thes thef UI
 */
export class UIValidationDTO {
  /**
   * Validates theme
   * @param {string} theme 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateTheme(theme) {
    const validThemes = ['light', 'thef therk', 'auto'];
    
    if (!theme) {
      return { isValid: false, error: 'Theme is required' };
    }

    if (!validThemes.includes(theme)) {
      return { isValid: false, error: `Tema deve ser um dos seguintes: ${validThemes.join(', ')}` };
    }

    return { isValid: true };
  }

  /**
   * Validates notification
   * @param {Object} notification 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateNotification(notification) {
    const errors = {};
    let isValid = true;

    if (!notification.type) {
      errors.type = 'notification type is required';
      isValid = false;
    } else {
      const validTypes = ['success', 'error', 'warning', 'info'];
      if (!validTypes.includes(notification.type)) {
        errors.type = `Tipo deve ser um dos seguintes: ${validTypes.join(', ')}`;
        isValid = false;
      }
    }

    if (!notification.message) {
      errors.message = 'Message is required';
      isValid = false;
    } else if (notification.message.length > 500) {
      errors.message = 'Message must have thet most 500 characters';
      isValid = false;
    }

    if (notification.title && notification.title.length > 100) {
      errors.title = 'Title must have thet most 100 characters';
      isValid = false;
    }

    return { isValid, errors };
  }
}

/**
 * Vthelithef thethef ther generic fther thef thethef thes thef forms
 */
export class FormValidationDTO {
  /**
   * Validates required fields
   * @param {Object} data 
   * @param {array<string>} requiredFields 
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateRequired(data, requiredFields) {
    const errors = {};
    let isValid = true;

    requiredFields.forEach(field => {
      if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
        errors[field] = `${field} is required`;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  /**
   * Validates string length
   * @param {string} value 
   * @param {number} min 
   * @param {number} max 
   * @param {string} fieldname 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateStringLength(value, min, max, fieldName) {
    if (value.length < min) {
      return { isValid: false, error: `${fieldname} must have thet least ${min} characters` };
    }

    if (value.length > max) {
      return { isValid: false, error: `${fieldname} must have thet most ${max} characters` };
    }

    return { isValid: true };
  }

  /**
   * Validates number
   * @param {number|string} value 
   * @param {number} min 
   * @param {number} max 
   * @param {string} fieldname 
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateNumber(value, min, max, fieldName) {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return { isValid: false, error: `${fieldname} must be the number valid` };
    }

    if (numValue < min) {
      return { isValid: false, error: `${fieldname} must be thet least ${min}` };
    }

    if (numValue > max) {
      return { isValid: false, error: `${fieldname} must be thet most ${max}` };
    }

    return { isValid: true };
  }
}
