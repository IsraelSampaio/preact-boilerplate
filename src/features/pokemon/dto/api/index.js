/**
 * DTOs da API para a feature Pokemon
 * Contém todos os DTOs relacionados à comunicação com a PokeAPI
 */

/**
 * DTO para resposta da lista de Pokémon da API
 */
export class PokemonListResponseDTO {
  constructor(data) {
    this.count = data.count || 0;
    this.next = data.next || null;
    this.previous = data.previous || null;
    this.results = (data.results || []).map(item => new PokemonListItemDTO(item));
  }

  /**
   * Converte para formato interno da aplicação
   * @returns {Object} Objeto no formato do Redux
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
 * DTO para item da lista de Pokémon
 */
export class PokemonListItemDTO {
  constructor(data) {
    this.name = data.name || '';
    this.url = data.url || '';
  }

  /**
   * Extrai o ID do Pokémon da URL
   * @returns {number|null} ID do Pokémon
   */
  getId() {
    const match = this.url.match(/\/(\d+)\/$/);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Converte para formato interno da aplicação
   * @returns {Object} Objeto no formato usado pelo Redux
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
 * DTO para Pokémon completo da API
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
   * Converte altura para metros
   * @returns {number} Altura em metros
   */
  getHeightInMeters() {
    return this.height / 10;
  }

  /**
   * Converte peso para quilogramas
   * @returns {number} Peso em quilogramas
   */
  getWeightInKg() {
    return this.weight / 10;
  }

  /**
   * Obtém o tipo primário do Pokémon
   * @returns {string} Nome do tipo primário
   */
  getPrimaryType() {
    return this.types.length > 0 ? this.types[0].type.name : 'unknown';
  }

  /**
   * Converte para formato interno da aplicação
   * @returns {Object} Objeto no formato usado pelo Redux
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
      // Campos calculados
      heightInMeters: this.getHeightInMeters(),
      weightInKg: this.getWeightInKg(),
      primaryType: this.getPrimaryType()
    };
  }
}

/**
 * DTO para sprites do Pokémon
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
 * DTO para tipo do Pokémon
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
 * DTO para estatísticas do Pokémon
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
 * DTO para habilidades do Pokémon
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
 * DTO para tipos de Pokémon
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
 * DTO para item de tipo de Pokémon
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
