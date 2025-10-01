/**
 * DTOs de validação para a feature Pokemon
 * Contém validadores específicos para dados relacionados aos Pokémon
 */

/**
 * Validador para dados de Pokémon
 */
export class PokemonValidationDTO {
  /**
   * Valida ID do Pokémon
   * @param {number|string} id
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateId(id) {
    if (!id) {
      return { isValid: false, error: "ID é obrigatório" };
    }

    const numId = Number(id);
    if (isNaN(numId) || numId <= 0) {
      return { isValid: false, error: "ID deve ser um número positivo" };
    }

    return { isValid: true };
  }

  /**
   * Valida nome do Pokémon
   * @param {string} name
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateName(name) {
    if (!name) {
      return { isValid: false, error: "Nome é obrigatório" };
    }

    if (name.length < 2) {
      return { isValid: false, error: "Nome deve ter pelo menos 2 caracteres" };
    }

    if (name.length > 50) {
      return { isValid: false, error: "Nome deve ter no máximo 50 caracteres" };
    }

    // Verifica se contém apenas letras, espaços e hífens
    const nameRegex = /^[a-zA-Z\s-]+$/;
    if (!nameRegex.test(name)) {
      return {
        isValid: false,
        error: "Nome deve conter apenas letras, espaços e hífens",
      };
    }

    return { isValid: true };
  }

  /**
   * Valida tipo do Pokémon
   * @param {string} type
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateType(type) {
    const validTypes = [
      "normal",
      "fire",
      "water",
      "electric",
      "grass",
      "ice",
      "fighting",
      "poison",
      "ground",
      "flying",
      "psychic",
      "bug",
      "rock",
      "ghost",
      "dragon",
      "dark",
      "steel",
      "fairy",
    ];

    if (!type) {
      return { isValid: false, error: "Tipo é obrigatório" };
    }

    if (!validTypes.includes(type.toLowerCase())) {
      return {
        isValid: false,
        error: `Tipo deve ser um dos seguintes: ${validTypes.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida dados de filtros
   * @param {Object} filters
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateFilters(filters) {
    const errors = {};
    let isValid = true;

    // Validar busca
    if (filters.search && filters.search.length > 100) {
      errors.search = "Busca deve ter no máximo 100 caracteres";
      isValid = false;
    }

    // Validar tipo se fornecido
    if (filters.type) {
      const typeValidation = this.validateType(filters.type);
      if (!typeValidation.isValid) {
        errors.type = typeValidation.error;
        isValid = false;
      }
    }

    // Validar ordenação
    const validSortBy = ["name", "id", "height", "weight"];
    if (filters.sortBy && !validSortBy.includes(filters.sortBy)) {
      errors.sortBy = `Ordenação deve ser um dos seguintes: ${validSortBy.join(
        ", ",
      )}`;
      isValid = false;
    }

    const validSortOrder = ["asc", "desc"];
    if (filters.sortOrder && !validSortOrder.includes(filters.sortOrder)) {
      errors.sortOrder = `Ordem deve ser um dos seguintes: ${validSortOrder.join(
        ", ",
      )}`;
      isValid = false;
    }

    return { isValid, errors };
  }

  /**
   * Valida dados completos do Pokémon
   * @param {Object} pokemonData
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validatePokemon(pokemonData) {
    const errors = {};
    let isValid = true;

    // Validar ID
    const idValidation = this.validateId(pokemonData.id);
    if (!idValidation.isValid) {
      errors.id = idValidation.error;
      isValid = false;
    }

    // Validar nome
    const nameValidation = this.validateName(pokemonData.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error;
      isValid = false;
    }

    // Validar altura
    if (pokemonData.height !== undefined) {
      const height = Number(pokemonData.height);
      if (isNaN(height) || height < 0 || height > 1000) {
        errors.height = "Altura deve ser um número entre 0 e 1000";
        isValid = false;
      }
    }

    // Validar peso
    if (pokemonData.weight !== undefined) {
      const weight = Number(pokemonData.weight);
      if (isNaN(weight) || weight < 0 || weight > 10000) {
        errors.weight = "Peso deve ser um número entre 0 e 10000";
        isValid = false;
      }
    }

    // Validar tipos
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
 * Validador para dados de paginação
 */
export class PaginationValidationDTO {
  /**
   * Valida página atual
   * @param {number|string} page
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validatePage(page) {
    if (!page) {
      return { isValid: false, error: "Página é obrigatória" };
    }

    const numPage = Number(page);
    if (isNaN(numPage) || numPage < 1) {
      return { isValid: false, error: "Página deve ser um número maior que 0" };
    }

    return { isValid: true };
  }

  /**
   * Valida itens por página
   * @param {number|string} limit
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateLimit(limit) {
    if (!limit) {
      return { isValid: false, error: "Limite é obrigatório" };
    }

    const numLimit = Number(limit);
    if (isNaN(numLimit) || numLimit < 1 || numLimit > 100) {
      return {
        isValid: false,
        error: "Limite deve ser um número entre 1 e 100",
      };
    }

    return { isValid: true };
  }

  /**
   * Valida dados de paginação
   * @param {Object} paginationData
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
