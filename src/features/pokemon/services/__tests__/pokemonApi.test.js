import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock do PokemonGraphQLApiService
vi.mock("../pokemonGraphQLApi.js", () => ({
  PokemonGraphQLApiService: {
    getPokemonList: vi.fn(),
    getPokemonById: vi.fn(),
    getPokemonByName: vi.fn(),
    getPokemonTypes: vi.fn(),
    getPokemonByType: vi.fn(),
    searchPokemon: vi.fn(),
  },
}));

import { PokemonApiService } from "../pokemonApi.js";
import {
  PokemonListResponseDTO,
  PokemonDTO,
  PokemonListItemDTO,
} from "../../dto/api/index.js";
import { ApiErrorDTO } from "../../../auth/dto/api/index.js";
import { PokemonGraphQLApiService } from "../pokemonGraphQLApi.js";

describe("PokemonApiService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPokemonList", () => {
    it("deve retornar uma lista de Pokémon com sucesso", async () => {
      const mockResponse = new PokemonListResponseDTO({
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
          { name: "charizard", url: "https://pokeapi.co/api/v2/pokemon/6/" },
        ],
      });

      vi.mocked(PokemonGraphQLApiService.getPokemonList).mockResolvedValueOnce(
        mockResponse,
      );

      const result = await PokemonApiService.getPokemonList(0, 20);

      expect(PokemonGraphQLApiService.getPokemonList).toHaveBeenCalledWith(
        0,
        20,
      );
      expect(result).toBeInstanceOf(PokemonListResponseDTO);
      expect(result.count).toBe(2);
    });

    it("deve lançar erro quando a requisição falha", async () => {
      const error = new ApiErrorDTO({
        message: "Network error",
        status: 500,
        code: "NETWORK_ERROR",
      });

      vi.mocked(PokemonGraphQLApiService.getPokemonList).mockRejectedValueOnce(
        error,
      );

      await expect(PokemonApiService.getPokemonList()).rejects.toThrow(
        ApiErrorDTO,
      );
    });
  });

  describe("getPokemonById", () => {
    it("deve retornar um Pokémon por ID com sucesso", async () => {
      const mockPokemon = new PokemonDTO({
        id: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        base_experience: 112,
        sprites: {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        },
        types: [
          {
            slot: 1,
            type: {
              name: "electric",
              url: "https://pokeapi.co/api/v2/type/13/",
            },
          },
        ],
        stats: [],
        abilities: [],
      });

      vi.mocked(PokemonGraphQLApiService.getPokemonById).mockResolvedValueOnce(
        mockPokemon,
      );

      const result = await PokemonApiService.getPokemonById(25);

      expect(PokemonGraphQLApiService.getPokemonById).toHaveBeenCalledWith(25);
      expect(result).toBeInstanceOf(PokemonDTO);
      expect(result.id).toBe(25);
    });

    it("deve lançar erro quando Pokémon não é encontrado", async () => {
      const error = new ApiErrorDTO({
        message: "Pokémon com ID 999 não encontrado",
        status: 404,
        code: "POKEMON_NOT_FOUND",
      });

      vi.mocked(PokemonGraphQLApiService.getPokemonById).mockRejectedValueOnce(
        error,
      );

      await expect(PokemonApiService.getPokemonById(999)).rejects.toThrow(
        ApiErrorDTO,
      );
    });
  });

  describe("getPokemonByName", () => {
    it("deve retornar um Pokémon por nome com sucesso", async () => {
      const mockPokemon = new PokemonDTO({
        id: 25,
        name: "pikachu",
        height: 4,
        weight: 60,
        base_experience: 112,
        sprites: {
          front_default:
            "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        },
        types: [
          {
            slot: 1,
            type: {
              name: "electric",
              url: "https://pokeapi.co/api/v2/type/13/",
            },
          },
        ],
        stats: [],
        abilities: [],
      });

      vi.mocked(
        PokemonGraphQLApiService.getPokemonByName,
      ).mockResolvedValueOnce(mockPokemon);

      const result = await PokemonApiService.getPokemonByName("pikachu");

      expect(PokemonGraphQLApiService.getPokemonByName).toHaveBeenCalledWith(
        "pikachu",
      );
      expect(result).toBeInstanceOf(PokemonDTO);
      expect(result.name).toBe("pikachu");
    });
  });

  describe("PokemonListItemDTO com tipos", () => {
    it("deve criar PokemonListItemDTO com tipos corretamente", () => {
      const pokemonData = {
        name: "pikachu",
        url: "https://pokeapi.co/api/v2/pokemon/25/",
        imageUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        id: 25,
        height: 4,
        weight: 60,
        types: [
          {
            slot: 1,
            type: {
              name: "electric",
              url: "https://pokeapi.co/api/v2/type/13/",
            },
          },
        ],
      };

      const pokemonItem = new PokemonListItemDTO(pokemonData);

      expect(pokemonItem.name).toBe("pikachu");
      expect(pokemonItem.id).toBe(25);
      expect(pokemonItem.types).toHaveLength(1);
      expect(pokemonItem.types[0].type.name).toBe("electric");
      expect(pokemonItem.getPrimaryType()).toBe("electric");
    });

    it('deve retornar "unknown" quando não há tipos', () => {
      const pokemonData = {
        name: "pikachu",
        url: "https://pokeapi.co/api/v2/pokemon/25/",
        imageUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png",
        id: 25,
        height: 4,
        weight: 60,
        types: [],
      };

      const pokemonItem = new PokemonListItemDTO(pokemonData);

      expect(pokemonItem.getPrimaryType()).toBe("unknown");
    });

    it("deve incluir tipos no formato interno", () => {
      const pokemonData = {
        name: "charizard",
        url: "https://pokeapi.co/api/v2/pokemon/6/",
        imageUrl:
          "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png",
        id: 6,
        height: 17,
        weight: 905,
        types: [
          {
            slot: 1,
            type: { name: "fire", url: "https://pokeapi.co/api/v2/type/10/" },
          },
          {
            slot: 2,
            type: { name: "flying", url: "https://pokeapi.co/api/v2/type/3/" },
          },
        ],
      };

      const pokemonItem = new PokemonListItemDTO(pokemonData);
      const internalData = pokemonItem.toInternal();

      expect(internalData.types).toHaveLength(2);
      expect(internalData.types[0].type.name).toBe("fire");
      expect(internalData.types[1].type.name).toBe("flying");
      expect(internalData.primaryType).toBe("fire");
    });
  });
});
