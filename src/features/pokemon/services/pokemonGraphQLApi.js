import { GraphQLClient, gql } from "graphql-request";
import {
  PokemonListResponseDTO,
  PokemonDTO,
  PokemonTypesResponseDTO,
  PokemonListItemDTO,
} from "../dto/api/index.js";
import { ApiErrorDTO } from "../../auth/dto/api/index.js";

const GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2/";
const REST_BASE_URL = "https://pokeapi.co/api/v2";

const client = new GraphQLClient(GRAPHQL_ENDPOINT);
const POKEMON_LIST_QUERY = gql`
  query GetPokemonList($limit: Int!, $offset: Int!) {
    pokemon(limit: $limit, offset: $offset) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        slot
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        effort
        stat {
          name
        }
      }
      pokemonabilities {
        is_hidden
        slot
        ability {
          name
        }
      }
    }
    pokemon_aggregate {
      aggregate {
        count
      }
    }
  }
`;

const POKEMON_BY_ID_QUERY = gql`
  query GetPokemonById($id: Int!) {
    pokemon(where: { id: { _eq: $id } }) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        slot
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        effort
        stat {
          name
        }
      }
      pokemonabilities {
        is_hidden
        slot
        ability {
          name
        }
      }
    }
  }
`;

const POKEMON_BY_NAME_QUERY = gql`
  query GetPokemonByName($name: String!) {
    pokemon(where: { name: { _eq: $name } }) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        slot
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        effort
        stat {
          name
        }
      }
      pokemonabilities {
        is_hidden
        slot
        ability {
          name
        }
      }
    }
  }
`;

const POKEMON_TYPES_QUERY = gql`
  query GetPokemonTypes {
    type {
      id
      name
    }
  }
`;

const POKEMON_BY_TYPE_QUERY = gql`
  query GetPokemonByType($typeName: String!, $limit: Int!, $offset: Int!) {
    pokemontype(
      where: { type: { name: { _eq: $typeName } } }
      limit: $limit
      offset: $offset
    ) {
      pokemon {
        id
        name
        height
        weight
        base_experience
        pokemonsprites {
          sprites
        }
        pokemontypes {
          slot
          type {
            name
          }
        }
        pokemonstats {
          base_stat
          effort
          stat {
            name
          }
        }
        pokemonabilities {
          is_hidden
          slot
          ability {
            name
          }
        }
      }
    }
    pokemontype_aggregate(where: { type: { name: { _eq: $typeName } } }) {
      aggregate {
        count
      }
    }
  }
`;

const SEARCH_POKEMON_QUERY = gql`
  query SearchPokemon($searchTerm: String!) {
    pokemon(where: { name: { _ilike: $searchTerm } }, limit: 50) {
      id
      name
      height
      weight
      base_experience
      pokemonsprites {
        sprites
      }
      pokemontypes {
        slot
        type {
          name
        }
      }
      pokemonstats {
        base_stat
        effort
        stat {
          name
        }
      }
      pokemonabilities {
        is_hidden
        slot
        ability {
          name
        }
      }
    }
  }
`;

/**
 * Converte dados do GraphQL para formato compatível com DTOs existentes
 */
class GraphQLDataTransformer {
  /**
   * Converte Pokémon do GraphQL para formato REST
   * @param {Object} graphqlPokemon
   * @returns {Object}
   */
  static transformPokemon(graphqlPokemon) {
    if (!graphqlPokemon) return null;

    const sprites = graphqlPokemon.pokemonsprites?.[0]?.sprites;
    let parsedSprites = {};

    if (sprites) {
      parsedSprites = sprites;
    }

    return {
      id: graphqlPokemon.id,
      name: graphqlPokemon.name,
      height: graphqlPokemon.height,
      weight: graphqlPokemon.weight,
      base_experience: graphqlPokemon.base_experience,
      sprites: {
        front_default:
          parsedSprites.other?.home?.front_default ||
          parsedSprites.front_default ||
          "",
        front_shiny:
          parsedSprites.other?.home?.front_shiny ||
          parsedSprites.front_shiny ||
          "",
        back_default: parsedSprites.back_default || "",
        back_shiny: parsedSprites.back_shiny || "",
      },
      types: (graphqlPokemon.pokemontypes || []).map((type) => ({
        slot: type.slot,
        type: {
          name: type.type.name,
          url: `${REST_BASE_URL}/type/${type.type.name}/`,
        },
      })),
      stats: (graphqlPokemon.pokemonstats || []).map((stat) => ({
        base_stat: stat.base_stat,
        effort: stat.effort,
        stat: {
          name: stat.stat.name,
          url: `${REST_BASE_URL}/stat/${stat.stat.name}/`,
        },
      })),
      abilities: (graphqlPokemon.pokemonabilities || []).map((ability) => ({
        ability: {
          name: ability.ability.name,
          url: `${REST_BASE_URL}/ability/${ability.ability.name}/`,
        },
        is_hidden: ability.is_hidden,
        slot: ability.slot,
      })),
    };
  }

  /**
   * Converte lista de Pokémon do GraphQL para formato REST
   * @param {Array} graphqlPokemonList
   * @param {number} totalCount
   * @param {number} offset
   * @param {number} limit
   * @returns {Object}
   */
  static transformPokemonList(graphqlPokemonList, totalCount, offset, limit) {
    const results = graphqlPokemonList.map((pokemon) => {
      let imageUrl = "";
      const sprites = pokemon.pokemonsprites?.[0]?.sprites;
      if (sprites) {
        imageUrl = sprites.other?.home?.front_default || "";
      }

      return {
        name: pokemon.name,
        url: `${REST_BASE_URL}/pokemon/${pokemon.id}/`,
        imageUrl: imageUrl,
        id: pokemon.id,
        height: pokemon.height,
        weight: pokemon.weight,
        types: (pokemon.pokemontypes || []).map((type) => ({
          slot: type.slot,
          type: {
            name: type.type.name,
            url: `${REST_BASE_URL}/type/${type.type.name}/`,
          },
        })),
      };
    });

    return {
      count: totalCount,
      next:
        offset + limit < totalCount
          ? `https://pokeapi.co/api/v2/pokemon?offset=${
              offset + limit
            }&limit=${limit}`
          : null,
      previous:
        offset > 0
          ? `https://pokeapi.co/api/v2/pokemon?offset=${Math.max(
              0,
              offset - limit,
            )}&limit=${limit}`
          : null,
      results,
    };
  }

  /**
   * Converte tipos do GraphQL para formato REST
   * @param {Array} graphqlTypes
   * @returns {Object}
   */
  static transformTypes(graphqlTypes) {
    return {
      count: graphqlTypes.length,
      results: graphqlTypes.map((type) => ({
        name: type.name,
        url: `https://pokeapi.co/api/v2/type/${type.id}/`,
      })),
    };
  }
}

export class PokemonGraphQLApiService {
  /**
   * @param {number} offset
   * @param {number} limit
   * @returns {Promise<PokemonListResponseDTO>}
   */
  static async getPokemonList(offset = 0, limit = 20) {
    try {
      const variables = { limit, offset };
      const data = await client.request(POKEMON_LIST_QUERY, variables);

      const transformedData = GraphQLDataTransformer.transformPokemonList(
        data.pokemon,
        data.pokemon_aggregate.aggregate.count,
        offset,
        limit,
      );

      return new PokemonListResponseDTO(transformedData);
    } catch (error) {
      throw new ApiErrorDTO({
        message: `Erro ao buscar lista de Pokémon: ${error.message}`,
        status: 0,
        code: "POKEMON_LIST_ERROR",
      });
    }
  }

  /**
   * @param {number} id
   * @returns {Promise<PokemonDTO>}
   */
  static async getPokemonById(id) {
    try {
      const variables = { id };
      const data = await client.request(POKEMON_BY_ID_QUERY, variables);

      if (!data.pokemon || data.pokemon.length === 0) {
        throw new ApiErrorDTO({
          message: `Pokémon com ID ${id} não encontrado`,
          status: 404,
          code: "POKEMON_NOT_FOUND",
        });
      }

      const transformedData = GraphQLDataTransformer.transformPokemon(
        data.pokemon[0],
      );
      return new PokemonDTO(transformedData);
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: `Erro ao buscar Pokémon ${id}: ${error.message}`,
        status: 0,
        code: "NETWORK_ERROR",
      });
    }
  }

  /**
   * @param {string} name
   * @returns {Promise<PokemonDTO>}
   */
  static async getPokemonByName(name) {
    try {
      const variables = { name: name.toLowerCase() };
      const data = await client.request(POKEMON_BY_NAME_QUERY, variables);

      if (!data.pokemon || data.pokemon.length === 0) {
        throw new ApiErrorDTO({
          message: `Pokémon ${name} não encontrado`,
          status: 404,
          code: "POKEMON_NOT_FOUND",
        });
      }

      const transformedData = GraphQLDataTransformer.transformPokemon(
        data.pokemon[0],
      );
      return new PokemonDTO(transformedData);
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: `Erro ao buscar Pokémon ${name}: ${error.message}`,
        status: 0,
        code: "NETWORK_ERROR",
      });
    }
  }

  /**
   * @returns {Promise<PokemonTypesResponseDTO>}
   */
  static async getPokemonTypes() {
    try {
      const data = await client.request(POKEMON_TYPES_QUERY);
      const transformedData = GraphQLDataTransformer.transformTypes(data.type);
      return new PokemonTypesResponseDTO(transformedData);
    } catch (error) {
      throw new ApiErrorDTO({
        message: `Erro ao buscar tipos de Pokémon: ${error.message}`,
        status: 0,
        code: "POKEMON_TYPES_ERROR",
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
    try {
      const variables = { typeName: type, limit, offset };
      const data = await client.request(POKEMON_BY_TYPE_QUERY, variables);

      const pokemonList = data.pokemontype.map((item) => {
        let imageUrl = "";
        const sprites = item.pokemon.pokemonsprites?.[0]?.sprites;
        if (sprites) {
          imageUrl = sprites.other?.home?.front_default || "";
        }

        const pokemonData = {
          name: item.pokemon.name,
          url: `${REST_BASE_URL}/pokemon/${item.pokemon.id}/`,
          imageUrl: imageUrl,
          id: item.pokemon.id,
          height: item.pokemon.height,
          weight: item.pokemon.weight,
          types: (item.pokemon.pokemontypes || []).map((type) => ({
            slot: type.slot,
            type: {
              name: type.type.name,
              url: `${REST_BASE_URL}/type/${type.type.name}/`,
            },
          })),
        };

        return new PokemonListItemDTO(pokemonData);
      });

      const totalCount = data.pokemontype_aggregate.aggregate.count;

      return {
        count: totalCount,
        next: offset + limit < totalCount ? "has_next" : null,
        previous: offset > 0 ? "has_previous" : null,
        results: pokemonList,
      };
    } catch (error) {
      throw new ApiErrorDTO({
        message: `Erro ao buscar Pokémon do tipo ${type}: ${error.message}`,
        status: 0,
        code: "POKEMON_BY_TYPE_ERROR",
      });
    }
  }

  /**
   * @param {string} query
   * @returns {Promise<Array<PokemonListItem>>}
   */
  static async searchPokemon(query) {
    try {
      const variables = { searchTerm: `%${query.toLowerCase()}%` };
      const data = await client.request(SEARCH_POKEMON_QUERY, variables);

      return data.pokemon.map((pokemon) => {
        let imageUrl = "";
        const sprites = pokemon.pokemonsprites?.[0]?.sprites;
        if (sprites) {
          imageUrl = sprites.other?.home?.front_default || "";
        }

        const pokemonData = {
          name: pokemon.name,
          url: `${REST_BASE_URL}/pokemon/${pokemon.id}/`,
          imageUrl: imageUrl,
          id: pokemon.id,
          height: pokemon.height,
          weight: pokemon.weight,
          types: (pokemon.pokemontypes || []).map((type) => ({
            slot: type.slot,
            type: {
              name: type.type.name,
              url: `${REST_BASE_URL}/type/${type.type.name}/`,
            },
          })),
        };

        return new PokemonListItemDTO(pokemonData);
      });
    } catch (error) {
      throw new ApiErrorDTO({
        message: `Erro ao buscar Pokémon: ${error.message}`,
        status: 0,
        code: "SEARCH_ERROR",
      });
    }
  }
}
