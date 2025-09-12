/**
 * DTOs for API contracts
 * These objects define the data structure that is sent/received from the API
 */

/**
 * DTO for Pokémon list API response
 * @typedef {Object} PokemonListResponseDTO
 * @property {number} count - Total available Pokémon
 * @property {string|null} next - URL for next page
 * @property {string|null} previous - URL for previous page
 * @property {Array<PokemonListItemDTO>} results - List of Pokémon
 */
export class PokemonListResponseDTO {
  constructor(data) {
    this.count = data.count || 0;
    this.next = data.next || null;
    this.previous = data.previous || null;
    this.results = (data.results || []).map(item => new PokemonListItemDTO(item));
  }

  /**
   * Converts to internal application format
   * @returns {Object} Object in Redux format
   */
  toInternal() {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map(item => item.toInternal())
    };
  }
}

/**
 * DTO for item of the Pokémon list
 * @typedef {Object} PokemonListItemDTO
 * @property {string} name - name Pokémon
 * @property {string} url - URL for fetches Pokémon
 */
export class PokemonListItemDTO {
  constructor(data) {
    this.name = data.name || '';
    this.url = data.url || '';
  }

  /**
   * Extract the Pokémon ID from the URL
   * @returns {number|null} Pokémon ID
   */
  getId() {
    const match = this.url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Converts to internal application format
   * @returns {Object} Object in format used by Redux
   */
  toInternal() {
    return {
      name: this.name,
      url: this.url,
      id: this.getId()
    };
  }
}

/**
 * DTO for Pokémon complete from the API
 * @typedef {Object} PokemonDTO
 * @property {number} id - ID unique Pokémon
 * @property {string} name - name Pokémon
 * @property {number} height - height in decimeters
 * @property {number} weight - Weight in hectograms
 * @property {number} base_experience - Base experience
 * @property {Object} sprites - Images Pokémon
 * @property {Array<Object>} types - Types Pokémon
 * @property {Array<Object>} stats - Statistics Pokémon
 * @property {Array<Object>} abilities - Abilities of Pokémon
 */
export class PokemonDTO {
  constructor(data) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.height = data.height || 0;
    this.weight = data.weight || 0;
    this.base_experience = data.base_experience || 0;
    this.sprites = new PokemonSpritesDTO(data.sprites || {});
    this.types = (data.types || []).map(type => new PokemonTypeDTO(type));
    this.stats = (data.stats || []).map(stat => new PokemonStatDTO(stat));
    this.abilities = (data.abilities || []).map(ability => new PokemonAbilityDTO(ability));
  }

  /**
   * Converts height to meters
   * @returns {number} height in meters
   */
  getHeightInMeters() {
    return this.height / 10;
  }

  /**
   * Converts weight to kilograms
   * @returns {number} Weight in kilograms
   */
  getWeightInKg() {
    return this.weight / 10;
  }

  /**
   * Gets the primary type Pokémon
   * @returns {string} Primary type name
   */
  getPrimaryType() {
    return this.types.length > 0 ? this.types[0].type.name : 'unknown';
  }

  /**
   * Converts to internal application format
   * @returns {Object} Object in format used by Redux
   */
  toInternal() {
    return {
      id: this.id,
      name: this.name,
      height: this.height,
      weight: this.weight,
      base_experience: this.base_experience,
      sprites: this.sprites.toInternal(),
      types: this.types.map(type => type.toInternal()),
      stats: this.stats.map(stat => stat.toInternal()),
      abilities: this.abilities.map(ability => ability.toInternal()),
      // Calculated fields
      heightInMeters: this.getHeightInMeters(),
      weightInKg: this.getWeightInKg(),
      primaryType: this.getPrimaryType()
    };
  }
}

/**
 * DTO for sprites Pokémon
 */
export class PokemonSpritesDTO {
  constructor(data) {
    this.front_default = data.front_default || '';
    this.front_shiny = data.front_shiny || '';
    this.back_default = data.back_default || '';
    this.back_shiny = data.back_shiny || '';
  }

  toInternal() {
    return {
      front_default: this.front_default,
      front_shiny: this.front_shiny,
      back_default: this.back_default,
      back_shiny: this.back_shiny
    };
  }
}

/**
 * DTO for type Pokémon
 */
export class PokemonTypeDTO {
  constructor(data) {
    this.slot = data.slot || 0;
    this.type = {
      name: data.type?.name || '',
      url: data.type?.url || ''
    };
  }

  toInternal() {
    return {
      slot: this.slot,
      type: this.type
    };
  }
}

/**
 * DTO for statistics Pokémon
 */
export class PokemonStatDTO {
  constructor(data) {
    this.base_stat = data.base_stat || 0;
    this.effort = data.effort || 0;
    this.stat = {
      name: data.stat?.name || '',
      url: data.stat?.url || ''
    };
  }

  toInternal() {
    return {
      base_stat: this.base_stat,
      effort: this.effort,
      stat: this.stat
    };
  }
}

/**
 * DTO for abilities Pokémon
 */
export class PokemonAbilityDTO {
  constructor(data) {
    this.ability = {
      name: data.ability?.name || '',
      url: data.ability?.url || ''
    };
    this.is_hidden = data.is_hidden || false;
    this.slot = data.slot || 0;
  }

  toInternal() {
    return {
      ability: this.ability,
      is_hidden: this.is_hidden,
      slot: this.slot
    };
  }
}

/**
 * DTO for types Pokémon
 */
export class PokemonTypesResponseDTO {
  constructor(data) {
    this.count = data.count || 0;
    this.results = (data.results || []).map(item => new PokemonTypeItemDTO(item));
  }

  toInternal() {
    return {
      count: this.count,
      results: this.results.map(item => item.toInternal())
    };
  }
}

/**
 * DTO for item type Pokémon
 */
export class PokemonTypeItemDTO {
  constructor(data) {
    this.name = data.name || '';
    this.url = data.url || '';
  }

  getId() {
    const match = this.url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : null;
  }

  toInternal() {
    return {
      name: this.name,
      url: this.url,
      id: this.getId()
    };
  }
}

/**
 * DTO for error from the API
 */
export class ApiErrorDTO {
  constructor(error) {
    this.message = error.message || 'Unknown error';
    this.status = error.status || 500;
    this.code = error.code || 'UNKNOWN_ERROR';
    this.timestamp = new Date().toISOString();
  }

  toInternal() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      timestamp: this.timestamp
    };
  }
}
