import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonApiService } from '../pokemonApi.js';

// Mock do fetch global
global.fetch = vi.fn();

describe('PokemonApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPokemonList', () => {
    it('deve retornar uma lista de Pokémon com sucesso', async () => {
      const mockResponse = {
        count: 2,
        next: null,
        previous: null,
        results: [
          { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' },
          { name: 'charizard', url: 'https://pokeapi.co/api/v2/pokemon/6/' },
        ],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      });

      const result = await PokemonApiService.getPokemonList(0, 20);

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');
      expect(result).toBeInstanceOf(Object);
      expect(result.count).toBe(2);
    });

    it('deve lançar erro quando a requisição falha', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(PokemonApiService.getPokemonList()).rejects.toThrow();
    });
  });

  describe('getPokemonById', () => {
    it('deve retornar um Pokémon por ID com sucesso', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        },
        types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
        stats: [],
        abilities: [],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await PokemonApiService.getPokemonById(25);

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/25');
      expect(result).toBeInstanceOf(Object);
      expect(result.id).toBe(25);
    });

    it('deve lançar erro quando Pokémon não é encontrado', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(PokemonApiService.getPokemonById(999)).rejects.toThrow();
    });
  });

  describe('getPokemonByName', () => {
    it('deve retornar um Pokémon por nome com sucesso', async () => {
      const mockPokemon = {
        id: 25,
        name: 'pikachu',
        height: 4,
        weight: 60,
        sprites: {
          front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
        },
        types: [{ slot: 1, type: { name: 'electric', url: 'https://pokeapi.co/api/v2/type/13/' } }],
        stats: [],
        abilities: [],
      };

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      });

      const result = await PokemonApiService.getPokemonByName('pikachu');

      expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
      expect(result).toBeInstanceOf(Object);
      expect(result.name).toBe('pikachu');
    });
  });
});
