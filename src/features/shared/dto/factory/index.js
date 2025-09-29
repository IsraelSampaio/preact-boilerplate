/**
 * Factory compartilhado para DTOs
 * Centraliza a criação de DTOs de diferentes features
 */

// Importa DTOs de outras features (evitando imports circulares)
import {
  PokemonDTO,
  PokemonListResponseDTO,
  PokemonListItemDTO,
  PokemonSpritesDTO,
  PokemonTypeDTO,
  PokemonStatDTO,
  PokemonAbilityDTO,
  PokemonTypesResponseDTO,
  PokemonTypeItemDTO
} from '../../../pokemon/dto/api/index.js';

import {
  PokemonStateDTO,
  PokemonFiltersDTO,
  PaginationDTO
} from '../../../pokemon/dto/redux/index.js';

import {
  ApiErrorDTO,
  LoginResponseDTO,
  LoginRequestDTO
} from '../../../auth/dto/api/index.js';

import {
  AuthStateDTO,
  UserDTO
} from '../../../auth/dto/redux/index.js';

import {
  UIStateDTO,
  NotificationDTO,
  ModalDTO,
  DrawerDTO
} from '../redux/index.js';

/**
 * Factory para criar DTOs baseado no tipo
 */
export class DTOFactory {
  /**
   * Cria um DTO baseado no tipo e dados fornecidos
   * @param {string} type - Tipo do DTO
   * @param {Object} data - Dados para criar o DTO
   * @returns {Object} Instância do DTO
   */
  static create(type, data) {
    const dtoMap = {
      // API DTOs - Pokemon
      'pokemon.api.pokemon': () => new PokemonDTO(data),
      'pokemon.api.pokemonList': () => new PokemonListResponseDTO(data),
      'pokemon.api.pokemonListItem': () => new PokemonListItemDTO(data),
      'pokemon.api.pokemonSprites': () => new PokemonSpritesDTO(data),
      'pokemon.api.pokemonType': () => new PokemonTypeDTO(data),
      'pokemon.api.pokemonStat': () => new PokemonStatDTO(data),
      'pokemon.api.pokemonAbility': () => new PokemonAbilityDTO(data),
      'pokemon.api.pokemonTypes': () => new PokemonTypesResponseDTO(data),
      'pokemon.api.pokemonTypeItem': () => new PokemonTypeItemDTO(data),

      // Redux DTOs - Pokemon
      'pokemon.redux.pokemonState': () => new PokemonStateDTO(data),
      'pokemon.redux.pokemonFilters': () => new PokemonFiltersDTO(data),
      'pokemon.redux.pagination': () => new PaginationDTO(data),

      // API DTOs - Auth
      'auth.api.error': () => new ApiErrorDTO(data),
      'auth.api.loginResponse': () => new LoginResponseDTO(data),
      'auth.api.loginRequest': () => new LoginRequestDTO(data),

      // Redux DTOs - Auth
      'auth.redux.authState': () => new AuthStateDTO(data),
      'auth.redux.user': () => new UserDTO(data),

      // Redux DTOs - Shared/UI
      'shared.redux.uiState': () => new UIStateDTO(data),
      'shared.redux.notification': () => new NotificationDTO(data),
      'shared.redux.modal': () => new ModalDTO(data),
      'shared.redux.drawer': () => new DrawerDTO(data),

      // Default
      'default': () => data
    };

    const creator = dtoMap[type] || dtoMap['default'];
    return creator();
  }

  /**
   * Cria múltiplos DTOs de uma lista
   * @param {string} type - Tipo do DTO
   * @param {Array} dataList - Lista de dados
   * @returns {Array} Lista de instâncias de DTO
   */
  static createList(type, dataList) {
    if (!Array.isArray(dataList)) {
      return [];
    }

    return dataList.map(data => this.create(type, data));
  }

  /**
   * Cria DTO com validação
   * @param {string} type - Tipo do DTO
   * @param {Object} data - Dados para validar e criar DTO
   * @param {Function} validator - Função de validação
   * @returns {Object} { isValid: boolean, dto?: Object, errors?: Object }
   */
  static createWithValidation(type, data, validator) {
    if (validator) {
      const validation = validator(data);
      if (!validation.isValid) {
        return {
          isValid: false,
          errors: validation.errors
        };
      }
    }

    try {
      const dto = this.create(type, data);
      return {
        isValid: true,
        dto
      };
    } catch (error) {
      return {
        isValid: false,
        errors: { general: error.message }
      };
    }
  }
}

/**
 * Utilitários para DTOs
 */
export class DTOUtils {
  /**
   * Converte DTO para objeto simples
   * @param {Object} dto - Instância do DTO
   * @returns {Object} Objeto simples
   */
  static toPlainObject(dto) {
    if (typeof dto.toPlainObject === 'function') {
      return dto.toPlainObject();
    }
    
    if (typeof dto.toInternal === 'function') {
      return dto.toInternal();
    }
    
    return dto;
  }

  /**
   * Converte lista de DTOs para objetos simples
   * @param {Array} dtoList - Lista de DTOs
   * @returns {Array} Lista de objetos simples
   */
  static toPlainObjectList(dtoList) {
    if (!Array.isArray(dtoList)) {
      return [];
    }

    return dtoList.map(dto => this.toPlainObject(dto));
  }

  /**
   * Clona um DTO
   * @param {Object} dto - DTO para clonar
   * @returns {Object} Nova instância do DTO
   */
  static clone(dto) {
    const plainObject = this.toPlainObject(dto);
    return { ...plainObject };
  }

  /**
   * Verifica se dois DTOs são iguais
   * @param {Object} dto1 - Primeiro DTO
   * @param {Object} dto2 - Segundo DTO
   * @returns {boolean} True se forem iguais
   */
  static equals(dto1, dto2) {
    const obj1 = this.toPlainObject(dto1);
    const obj2 = this.toPlainObject(dto2);
    
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Mescla dois DTOs
   * @param {Object} baseDto - DTO base
   * @param {Object} updateDto - DTO com atualizações
   * @returns {Object} DTO mesclado
   */
  static merge(baseDto, updateDto) {
    const baseObj = this.toPlainObject(baseDto);
    const updateObj = this.toPlainObject(updateDto);
    
    return { ...baseObj, ...updateObj };
  }

  /**
   * Serializa DTO para JSON
   * @param {Object} dto - DTO para serializar
   * @returns {string} JSON string
   */
  static serialize(dto) {
    const plainObject = this.toPlainObject(dto);
    return JSON.stringify(plainObject);
  }

  /**
   * Deserializa JSON para objeto simples
   * @param {string} jsonString - JSON string
   * @returns {Object} Objeto deserializado
   */
  static deserialize(jsonString) {
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      throw new Error(`Erro ao deserializar JSON: ${error.message}`);
    }
  }
}

/**
 * Constantes para tipos de DTO
 */
export const DTO_TYPES = {
  // Pokemon
  POKEMON: {
    API: {
      POKEMON: 'pokemon.api.pokemon',
      POKEMON_LIST: 'pokemon.api.pokemonList',
      POKEMON_LIST_ITEM: 'pokemon.api.pokemonListItem',
      POKEMON_SPRITES: 'pokemon.api.pokemonSprites',
      POKEMON_TYPE: 'pokemon.api.pokemonType',
      POKEMON_STAT: 'pokemon.api.pokemonStat',
      POKEMON_ABILITY: 'pokemon.api.pokemonAbility',
      POKEMON_TYPES: 'pokemon.api.pokemonTypes',
      POKEMON_TYPE_ITEM: 'pokemon.api.pokemonTypeItem'
    },
    REDUX: {
      POKEMON_STATE: 'pokemon.redux.pokemonState',
      POKEMON_FILTERS: 'pokemon.redux.pokemonFilters',
      PAGINATION: 'pokemon.redux.pagination'
    }
  },

  // Auth
  AUTH: {
    API: {
      ERROR: 'auth.api.error',
      LOGIN_RESPONSE: 'auth.api.loginResponse',
      LOGIN_REQUEST: 'auth.api.loginRequest'
    },
    REDUX: {
      AUTH_STATE: 'auth.redux.authState',
      USER: 'auth.redux.user'
    }
  },

  // Shared
  SHARED: {
    REDUX: {
      UI_STATE: 'shared.redux.uiState',
      NOTIFICATION: 'shared.redux.notification',
      MODAL: 'shared.redux.modal',
      DRAWER: 'shared.redux.drawer'
    }
  }
};
