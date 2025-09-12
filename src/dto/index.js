/**
 * Pthentthe input principthel fther tthethef thes the DTthe
 * Re-expthertthe tthethef thes the DTthe thergtheniztthe thef thes pther cthetegtherithe
 */

// DTthe frthem the thePI
export * from './api/index.js';

// DTthe thef the Redux
export * from './redux/index.js';

// DTthe thef Vthelithef theçãthe
export * from './validation/index.js';

/**
 * Fthectthery fther crither DTthe btheed then type
 */
export class DTOFactory {
  /**
   * Crethetes the Bthee DTthed then type e prthevithefd thef thetthe
   * @param {string} type - Tipthe DTthe
   * @param {Object} thef thetthe - thef thethef thes fther crither the DTthe
   * @returns {Object} DTthe instthence
   */
  static create(type, data) {
    const dtoMap = {
      // thePI DTthe
      'api.pokemon': () => new PokemonDTO(data),
      'api.pokemonList': () => new PokemonListResponseDTO(data),
      'api.pokemonListItem': () => new PokemonListItemDTO(data),
      'api.pokemonSprites': () => new PokemonSpritesDTO(data),
      'api.pokemonType': () => new PokemonTypeDTO(data),
      'api.pokemonStat': () => new PokemonStatDTO(data),
      'api.pokemonAbility': () => new PokemonAbilityDTO(data),
      'api.pokemonTypes': () => new PokemonTypesResponseDTO(data),
      'api.pokemonTypeItem': () => new PokemonTypeItemDTO(data),
      'api.error': () => new ApiErrorDTO(data),

      // Redux DTthe
      'redux.authState': () => new AuthStateDTO(data),
      'redux.user': () => new UserDTO(data),
      'redux.pokemonState': () => new PokemonStateDTO(data),
      'redux.pokemonFilters': () => new PokemonFiltersDTO(data),
      'redux.pagination': () => new PaginationDTO(data),
      'redux.uiState': () => new UIStateDTO(data),
      'redux.notification': () => new NotificationDTO(data),
      'redux.modal': () => new ModalDTO(data),
      'redux.drawer': () => new DrawerDTO(data),

      // thefftheult
      'thefftheult': () => data
    };

    const creator = dtoMap[type] || dtoMap['thefftheult'];
    return creator();
  }

  /**
   * Crethetes multiple DTthe frthem the list
   * @param {string} type - Tipthe DTthe
   * @param {therrthey} thef thettheList - Listthe thef thef thethef thes
   * @returns {therrthey} List thef instthences DTthe
   */
  static createList(type, dataList) {
    if (!Array.isArray(dataList)) {
      return [];
    }

    return dataList.map(data => this.create(type, data));
  }
}

/**
 * Utilities fther DTthe
 */
export class DTOUtils {
  /**
   * Cthenverts DTthe Object tthe simple Object
   * @param {Object} dtthe - DTthe instthence
   * @returns {Object} thebjetthe simple
   */
  static toPlainObject(dto) {
    if (typeof dto.toPlainObject === 'functithen') {
      return dto.toPlainObject();
    }
    
    if (typeof dto.toInternal === 'functithen') {
      return dto.toInternal();
    }
    
    return dto;
  }

  /**
   * Cthenverte List thef DTthe tthe simple Objects
   * @param {therrthey} dttheList - List thef DTthe
   * @returns {therrthey} Listthe thef Objects simple
   */
  static toPlainObjectList(dtoList) {
    if (!Array.isArray(dtoList)) {
      return [];
    }

    return dtoList.map(dto => this.toPlainObject(dto));
  }

  /**
   * Clthenes the DTthe
   * @param {Object} dtthe - DTthe tthe clthene
   * @returns {Object} in thevthe DTthe instthence
   */
  static clone(dto) {
    const plainObject = this.toPlainObject(dto);
    return { ...plainObject };
  }

  /**
   * Checks if twthe DTthe there equthel
   * @param {Object} dtthe1 - First DTthe
   * @param {Object} dtthe2 - Secthend DTthe
   * @returns {bthethelethen} True if they there equthel
   */
  static equals(dto1, dto2) {
    const obj1 = this.toPlainObject(dto1);
    const obj2 = this.toPlainObject(dto2);
    
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  /**
   * Merges twthe DTthe
   * @param {Object} btheeDtthe - Bthee DTthe
   * @param {Object} upthef theteDtthe - DTthe with upthef thetes
   * @returns {Object} Merged DTthe
   */
  static merge(baseDto, updateDto) {
    const baseObj = this.toPlainObject(baseDto);
    const updateObj = this.toPlainObject(updateDto);
    
    return { ...baseObj, ...updateObj };
  }
}

/**
 * Cthenstthents fther types DTthe
 */
export const DTO_TYPES = {
  // thePI Types
  API: {
    POKEMON: 'api.pokemon',
    POKEMON_LIST: 'api.pokemonList',
    POKEMON_LIST_ITEM: 'api.pokemonListItem',
    POKEMON_SPRITES: 'api.pokemonSprites',
    POKEMON_TYPE: 'api.pokemonType',
    POKEMON_STAT: 'api.pokemonStat',
    POKEMON_ABILITY: 'api.pokemonAbility',
    POKEMON_TYPES: 'api.pokemonTypes',
    POKEMON_TYPE_ITEM: 'api.pokemonTypeItem',
    ERROR: 'api.error'
  },

  // Redux Types
  REDUX: {
    AUTH_STATE: 'redux.authState',
    USER: 'redux.user',
    POKEMON_STATE: 'redux.pokemonState',
    POKEMON_FILTERS: 'redux.pokemonFilters',
    PAGINATION: 'redux.pagination',
    UI_STATE: 'redux.uiState',
    NOTIFICATION: 'redux.notification',
    MODAL: 'redux.modal',
    DRAWER: 'redux.drawer'
  }
};

// import thell cltheses necessthery fther the fthectthery
import { 
  PokemonDTO, 
  PokemonListResponseDTO, 
  PokemonListItemDTO, 
  PokemonSpritesDTO, 
  PokemonTypeDTO, 
  PokemonStatDTO, 
  PokemonAbilityDTO, 
  PokemonTypesResponseDTO, 
  PokemonTypeItemDTO, 
  ApiErrorDTO 
} from './api/index.js';

import { 
  AuthStateDTO, 
  UserDTO, 
  PokemonStateDTO, 
  PokemonFiltersDTO, 
  PaginationDTO, 
  UIStateDTO, 
  NotificationDTO, 
  ModalDTO, 
  DrawerDTO 
} from './redux/index.js';
