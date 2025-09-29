import { PokemonListResponseDTO, PokemonDTO, PokemonTypesResponseDTO } from '../dto/api/index.js';
import { ApiErrorDTO } from '../../auth/dto/api/index.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonApiService {
  /**
   * @param {number} offset 
   * @param {number} limit 
   * @returns {Promise<PokemonListResponseDTO>}
   */
  static async getPokemonList(offset = 0, limit = 20) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
      
      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `Erro ao buscar lista de Pokémon: ${response.statusText}`,
          status: response.status,
          code: 'POKEMON_LIST_ERROR'
        });
      }
      
      const data = await response.json();
      return new PokemonListResponseDTO(data);
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: error.message || 'Erro ao buscar lista de Pokémon',
        status: 0,
        code: 'NETWORK_ERROR'
      });
    }
  }

  /**
   * @param {number} id 
   * @returns {Promise<PokemonDTO>}
   */
  static async getPokemonById(id) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${id}`);
      
      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `Erro ao buscar Pokémon ${id}: ${response.statusText}`,
          status: response.status,
          code: 'POKEMON_BY_ID_ERROR'
        });
      }
      
      const data = await response.json();
      return new PokemonDTO(data);
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: error.message || `Erro ao buscar Pokémon ${id}`,
        status: 0,
        code: 'NETWORK_ERROR'
      });
    }
  }

  /**
   * @param {string} name 
   * @returns {Promise<PokemonDTO>}
   */
  static async getPokemonByName(name) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
      
      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `Erro ao buscar Pokémon ${name}: ${response.statusText}`,
          status: response.status,
          code: 'POKEMON_BY_NAME_ERROR'
        });
      }
      
      const data = await response.json();
      return new PokemonDTO(data);
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: error.message || `Erro ao buscar Pokémon ${name}`,
        status: 0,
        code: 'NETWORK_ERROR'
      });
    }
  }

  /**
   * @returns {Promise<PokemonTypesResponseDTO>}
   */
  static async getPokemonTypes() {
    try {
      const response = await fetch(`${BASE_URL}/type`);
      
      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `Erro ao buscar tipos de Pokémon: ${response.statusText}`,
          status: response.status,
          code: 'POKEMON_TYPES_ERROR'
        });
      }
      
      const data = await response.json();
      return new PokemonTypesResponseDTO(data);
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: error.message || 'Erro ao buscar tipos de Pokémon',
        status: 0,
        code: 'NETWORK_ERROR'
      });
    }
  }

  /**
   * @param {string} type 
   * @param {number} offset 
   * @param {number} limit 
   * @returns {Promise<PokemonListResponse>}
   */
  static async getPokemonByType(type, offset = 0, limit = 20) {
    const response = await fetch(`${BASE_URL}/type/${type}`);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar Pokémon do tipo ${type}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // A API de tipo retorna uma estrutura diferente, então precisamos adaptar
    const pokemonList = data.pokemon.slice(offset, offset + limit).map((item) => ({
      name: item.pokemon.name,
      url: item.pokemon.url
    }));

    return {
      count: data.pokemon.length,
      next: offset + limit < data.pokemon.length ? 'has_next' : null,
      previous: offset > 0 ? 'has_previous' : null,
      results: pokemonList
    };
  }

  /**
   * @param {string} query 
   * @returns {Promise<Array<PokemonListItem>>}
   */
  static async searchPokemon(query) {
    // Para busca, vamos usar a API de lista e filtrar no frontend
    // Em uma aplicação real, você preferiria implementar a API de busca no backend
    const response = await this.getPokemonList(0, 1000); // Buscar muito para ter base boa de busca
    return response.results.filter(pokemon => 
      pokemon.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
