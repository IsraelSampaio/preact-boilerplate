# 🌐 APIs e Serviços

## 📋 Visão Geral

Esta documentação detalha a integração com as APIs externas e a camada de serviços da aplicação Pokémon, incluindo tanto a API REST quanto a GraphQL.

## 🔗 PokéAPI REST

### Base URL

```
https://pokeapi.co/api/v2
```

### Endpoints Principais

#### Lista de Pokémon

```javascript
GET /pokemon?offset={offset}&limit={limit}
```

- **Parâmetros**: offset (número), limit (número)
- **Retorno**: Lista paginada de Pokémon
- **Exemplo**: `/pokemon?offset=0&limit=20`

#### Detalhes do Pokémon

```javascript
GET / pokemon / { id_or_name };
```

- **Parâmetros**: ID numérico ou nome do Pokémon
- **Retorno**: Informações completas do Pokémon
- **Exemplo**: `/pokemon/1` ou `/pokemon/pikachu`

#### Tipos de Pokémon

```javascript
GET / type;
```

- **Retorno**: Lista de todos os tipos disponíveis
- **Uso**: Para filtros na interface

### Implementação no Service

#### `pokemonApi.js`

```javascript
export class PokemonApiService {
  static async getPokemonList(offset = 0, limit = 20) {
    const response = await fetch(
      `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
    );
    const data = await response.json();
    return new PokemonListResponseDTO(data);
  }

  static async getPokemonById(id) {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    const data = await response.json();
    return new PokemonDTO(data);
  }

  static async getPokemonTypes() {
    const response = await fetch(`${BASE_URL}/type`);
    const data = await response.json();
    return new PokemonTypesResponseDTO(data);
  }
}
```

## 🔗 PokéAPI GraphQL

### Base URL

```
https://graphql.pokeapi.co/v1beta2/
```

### Queries Principais

#### Lista de Pokémon com Detalhes

```graphql
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
```

#### Pokémon por ID

```graphql
query GetPokemonById($id: Int!) {
  pokemon_by_pk(id: $id) {
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
```

### Implementação no Service

#### `pokemonGraphQLApi.js`

```javascript
import { GraphQLClient, gql } from "graphql-request";

const GRAPHQL_ENDPOINT = "https://graphql.pokeapi.co/v1beta2/";
const client = new GraphQLClient(GRAPHQL_ENDPOINT);

export class PokemonGraphQLService {
  static async getPokemonList(limit = 20, offset = 0) {
    try {
      const data = await client.request(POKEMON_LIST_QUERY, {
        limit,
        offset,
      });
      return this.transformGraphQLResponse(data);
    } catch (error) {
      throw new ApiErrorDTO(
        "Erro ao buscar lista de Pokémon via GraphQL",
        error,
      );
    }
  }

  static async getPokemonById(id) {
    try {
      const data = await client.request(POKEMON_BY_ID_QUERY, { id });
      return this.transformSinglePokemon(data.pokemon_by_pk);
    } catch (error) {
      throw new ApiErrorDTO("Erro ao buscar Pokémon via GraphQL", error);
    }
  }
}
```

## 📦 DTOs (Data Transfer Objects)

### Estrutura dos DTOs

#### `PokemonListResponseDTO`

```javascript
export class PokemonListResponseDTO {
  constructor(data) {
    this.count = data.count || 0;
    this.next = data.next || null;
    this.previous = data.previous || null;
    this.results = (data.results || []).map(
      (item) => new PokemonListItemDTO(item),
    );
  }

  toInternal() {
    return {
      count: this.count,
      next: this.next,
      previous: this.previous,
      results: this.results.map((item) => item.toInternal()),
    };
  }
}
```

#### `PokemonDTO`

```javascript
export class PokemonDTO {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.height = data.height;
    this.weight = data.weight;
    this.baseExperience = data.base_experience;
    this.sprites = this.parseSprites(data.sprites);
    this.types = this.parseTypes(data.types);
    this.stats = this.parseStats(data.stats);
    this.abilities = this.parseAbilities(data.abilities);
  }

  toInternal() {
    return {
      id: this.id,
      name: this.name,
      height: this.height,
      weight: this.weight,
      heightInMeters: this.height / 10,
      weightInKg: this.weight / 10,
      baseExperience: this.baseExperience,
      sprites: this.sprites,
      types: this.types,
      stats: this.stats,
      abilities: this.abilities,
      imageUrl: this.sprites?.front_default || "/placeholder-pokemon.png",
    };
  }
}
```

## 🔄 Transformação de Dados

### GraphQL → Internal Format

```javascript
static transformGraphQLResponse(data) {
  const pokemonList = data.pokemon.map(pokemon => ({
    id: pokemon.id,
    name: pokemon.name,
    height: pokemon.height,
    weight: pokemon.weight,
    baseExperience: pokemon.base_experience,
    sprites: this.parseGraphQLSprites(pokemon.pokemonsprites),
    types: this.parseGraphQLTypes(pokemon.pokemontypes),
    stats: this.parseGraphQLStats(pokemon.pokemonstats),
    abilities: this.parseGraphQLAbilities(pokemon.pokemonabilities)
  }));

  return new PokemonListResponseDTO({
    count: data.pokemon_aggregate.aggregate.count,
    next: null, // GraphQL não retorna paginação da mesma forma
    previous: null,
    results: pokemonList
  });
}
```

## ⚡ Otimizações e Performance

### Cache Strategy

```javascript
// Cache simples em memória
const cache = new Map();

export class PokemonApiService {
  static async getPokemonById(id) {
    const cacheKey = `pokemon_${id}`;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    const pokemon = await this.fetchPokemonById(id);
    cache.set(cacheKey, pokemon);
    return pokemon;
  }
}
```

### Error Handling

```javascript
export class ApiErrorDTO extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = "ApiErrorDTO";
    this.originalError = originalError;
    this.timestamp = new Date().toISOString();
  }

  toInternal() {
    return {
      message: this.message,
      timestamp: this.timestamp,
      hasOriginalError: !!this.originalError,
    };
  }
}
```

## 🔧 Configuração do Cliente GraphQL

```javascript
import { GraphQLClient } from "graphql-request";

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 segundos
  retry: 3,
  retryDelay: 1000,
});
```

## 📊 Métricas e Monitoramento

### Performance Tracking

```javascript
export class PokemonApiService {
  static async getPokemonList(offset = 0, limit = 20) {
    const startTime = performance.now();

    try {
      const result = await this.fetchPokemonList(offset, limit);
      const endTime = performance.now();

      console.log(`Pokemon list fetched in ${endTime - startTime}ms`);
      return result;
    } catch (error) {
      console.error("Error fetching pokemon list:", error);
      throw error;
    }
  }
}
```

## 🔐 Segurança

### Validação de Dados

```javascript
export class PokemonDTO {
  constructor(data) {
    // Validação básica
    if (!data || typeof data !== "object") {
      throw new ApiErrorDTO("Invalid Pokemon data");
    }

    this.id = this.validateId(data.id);
    this.name = this.validateName(data.name);
    // ... outras validações
  }

  validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new ApiErrorDTO("Invalid Pokemon ID");
    }
    return id;
  }

  validateName(name) {
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      throw new ApiErrorDTO("Invalid Pokemon name");
    }
    return name.trim().toLowerCase();
  }
}
```

## 🧪 Testes

### Mock da API

```javascript
// __tests__/pokemonApi.test.js
import { PokemonApiService } from "../services/pokemonApi.js";

describe("PokemonApiService", () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });

  it("should fetch pokemon list successfully", async () => {
    const mockData = {
      count: 1000,
      results: [
        { name: "pikachu", url: "https://pokeapi.co/api/v2/pokemon/25/" },
      ],
    };

    fetch.mockResolvedValueOnce({
      json: async () => mockData,
    });

    const result = await PokemonApiService.getPokemonList();

    expect(result).toBeInstanceOf(PokemonListResponseDTO);
    expect(result.count).toBe(1000);
  });
});
```

## 📈 Próximas Implementações

### Features Planejadas

- **Rate Limiting**: Controle de taxa de requisições
- **Retry Logic**: Lógica de retry automático
- **Offline Support**: Cache para funcionamento offline
- **Real-time Updates**: WebSocket para atualizações em tempo real
- **Analytics**: Tracking de uso das APIs

### Otimizações Futuras

- **Request Deduplication**: Evitar requisições duplicadas
- **Prefetching**: Carregamento antecipado de dados
- **Compression**: Compressão de dados de resposta
- **CDN**: Cache distribuído para melhor performance

---

_Documentação das APIs e serviços atualizada com as implementações mais recentes._
