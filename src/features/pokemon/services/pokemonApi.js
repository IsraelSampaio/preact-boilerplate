import { PokemonGraphQLApiService } from "./pokemonGraphQLApi.js";

export class PokemonApiService {
  /**
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<PokemonListResponseDTO>}
   */
  static async getPokemonList(offset = 0, limit = 20) {
    return PokemonGraphQLApiService.getPokemonList(offset, limit);
  }

  /**
   * @param {number} id
   * @returns {Promise<PokemonDTO>}
   */
  static async getPokemonById(id) {
    return PokemonGraphQLApiService.getPokemonById(id);
  }

  /**
   * @param {string} name
   * @returns {Promise<PokemonDTO>}
   */
  static async getPokemonByName(name) {
    return PokemonGraphQLApiService.getPokemonByName(name);
  }

  /**
   * @returns {Promise<PokemonTypesResponseDTO>}
   */
  static async getPokemonTypes() {
    return PokemonGraphQLApiService.getPokemonTypes();
  }

  /**
   * @param {string} type
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<PokemonListResponse>}
   */
  static async getPokemonByType(type, offset = 0, limit = 20) {
    return PokemonGraphQLApiService.getPokemonByType(type, offset, limit);
  }

  /**
   * @param {string} query
   * @returns {Promise<Array<PokemonListItem>>}
   */
  static async searchPokemon(query) {
    return PokemonGraphQLApiService.searchPokemon(query);
  }
}
