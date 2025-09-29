# 🔧 Camada de Serviços

## 📋 Visão Geral

A camada de serviços é responsável por abstrair a comunicação com APIs externas, gerenciar cache, tratamento de erros e transformação de dados. Esta documentação detalha os padrões implementados na aplicação Pokémon.

## 🏗️ Arquitetura de Serviços

### 1. **Estrutura de Pastas**

```
src/features/
├── pokemon/
│   └── services/
│       ├── pokemonApi.js        # Service principal para PokéAPI
│       └── __tests__/           # Testes dos services
│           └── pokemonApi.test.js
├── auth/
│   └── services/                # Services de autenticação (futuro)
└── shared/
    └── services/                # Services compartilhados (futuro)
        ├── cacheService.js      # Gerenciamento de cache
        └── httpClient.js        # Cliente HTTP base
```

### 2. **Responsabilidades da Camada**

- **Comunicação com APIs**: HTTP requests e responses
- **Tratamento de Erros**: Padronização de erros da API
- **Transformação de Dados**: DTOs para normalização
- **Cache**: Estratégias de caching (futuro)
- **Retry Logic**: Tentativas em caso de falha (futuro)

## 🎯 PokemonApiService

### 1. **Implementação Principal**

```javascript
// src/features/pokemon/services/pokemonApi.js
import { 
  PokemonListResponseDTO, 
  PokemonDTO, 
  PokemonTypesResponseDTO
} from '../dto/api/index.js';
import { ApiErrorDTO } from '../../auth/dto/api/index.js';

const BASE_URL = 'https://pokeapi.co/api/v2';

export class PokemonApiService {
  /**
   * Busca lista paginada de Pokémon
   * @param {number} offset - Offset para paginação
   * @param {number} limit - Limite de itens por página
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
   * Busca Pokémon específico por ID
   * @param {number} id - ID do Pokémon
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
   * Busca Pokémon específico por nome
   * @param {string} name - Nome do Pokémon
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
   * Busca lista de tipos de Pokémon
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
}
```

## 🎪 Padrões de Design

### 1. **Static Methods Pattern**

```javascript
// ✅ Padrão: Métodos estáticos para services stateless
export class PokemonApiService {
  static async getPokemonList() {
    // Implementation
  }
}

// Uso simples:
const pokemonList = await PokemonApiService.getPokemonList();
```

### 2. **Error Handling Pattern**

```javascript
// ✅ Padrão: Tratamento consistente de erros
static async apiMethod() {
  try {
    const response = await fetch(url);
    
    // Verificação de status HTTP
    if (!response.ok) {
      throw new ApiErrorDTO({
        message: `Erro específico: ${response.statusText}`,
        status: response.status,
        code: 'SPECIFIC_ERROR_CODE'
      });
    }
    
    const data = await response.json();
    return new SpecificDTO(data); // ✅ Sempre retorna DTO
  } catch (error) {
    // Re-throw DTOs personalizados
    if (error instanceof ApiErrorDTO) {
      throw error;
    }
    
    // Wrapper para erros não tratados
    throw new ApiErrorDTO({
      message: error.message || 'Erro genérico',
      status: 0,
      code: 'NETWORK_ERROR'
    });
  }
}
```

### 3. **DTO Transformation Pattern**

```javascript
// ✅ Padrão: Sempre transformar dados da API
static async getPokemon(id) {
  const response = await fetch(`/api/pokemon/${id}`);
  const data = await response.json();
  
  // Transformação imediata com DTO
  return new PokemonDTO(data);
}

// ✅ Uso no hook
const { data } = await PokemonApiService.getPokemon(25);
const internalData = data.toInternal(); // Dados normalizados
```

## 🔄 Integração com Hooks

### 1. **Uso em Custom Hooks**

```javascript
// src/hooks/usePokemon.js
export const usePokemon = () => {
  const dispatch = useAppDispatch();

  const fetchPokemonList = useCallback(async (page = 1, limit = 20) => {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const offset = (page - 1) * limit;
      
      // ✅ Service abstrai complexidade da API
      const response = await PokemonApiService.getPokemonList(offset, limit);
      
      // ✅ DTO fornece dados normalizados
      const internalData = response.toInternal();
      
      dispatch(setPokemonList(internalData.results));
      dispatch(setPagination({
        currentPage: page,
        totalPages: Math.ceil(internalData.count / limit),
        hasNext: !!internalData.next,
        hasPrevious: !!internalData.previous,
      }));
    } catch (error) {
      let errorMessage = 'Erro ao carregar Pokémon';
      
      // ✅ Tratamento específico para DTOs de erro
      if (error instanceof ApiErrorDTO) {
        errorMessage = error.message;
        
        // Log detalhado para debugging
        console.error('API Error:', {
          message: error.message,
          status: error.status,
          code: error.code
        });
      }
      
      dispatch(setError(errorMessage));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return { fetchPokemonList };
};
```

### 2. **Busca por Nome com Debounce**

```javascript
export const usePokemonSearch = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const searchPokemon = useCallback(
    debounce(async (query) => {
      if (!query || query.length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      
      try {
        // ✅ Service handle search logic
        const pokemon = await PokemonApiService.getPokemonByName(query);
        setSearchResults([pokemon.toInternal()]);
      } catch (error) {
        if (error instanceof ApiErrorDTO && error.status === 404) {
          setSearchResults([]);
        } else {
          console.error('Search error:', error);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  return { searchPokemon, searchResults, isSearching };
};
```

## 🧪 Estratégias de Teste

### 1. **Mock Global do Fetch**

```javascript
// src/services/__tests__/pokemonApi.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonApiService } from '../pokemonApi.js';

// Mock global do fetch
global.fetch = vi.fn();

describe('PokemonApiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPokemonList', () => {
    it('deve retornar lista de Pokémon com sucesso', async () => {
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
        status: 404,
      });

      await expect(PokemonApiService.getPokemonList()).rejects.toThrow();
    });
  });
});
```

### 2. **Teste de Transformação DTO**

```javascript
describe('DTO Integration', () => {
  it('deve transformar dados da API corretamente', async () => {
    const mockPokemon = {
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      sprites: {
        front_default: 'https://example.com/pikachu.png',
      },
      types: [{ slot: 1, type: { name: 'electric' } }],
      stats: [],
      abilities: [],
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    });

    const result = await PokemonApiService.getPokemonById(25);
    const internal = result.toInternal();

    expect(internal.id).toBe(25);
    expect(internal.name).toBe('pikachu');
    expect(internal.heightInMeters).toBe(0.4); // DTO calculation
    expect(internal.primaryType).toBe('electric'); // DTO logic
  });
});
```

## 🚀 Padrões Avançados (Futuro)

### 1. **HTTP Client Base**

```javascript
// src/services/httpClient.js (futuro)
class HttpClient {
  constructor(baseURL, defaultHeaders = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new ApiErrorDTO({
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
        code: 'HTTP_ERROR'
      });
    }

    return response.json();
  }

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, data, options) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

// Usage
const pokemonClient = new HttpClient('https://pokeapi.co/api/v2');
```

### 2. **Cache Service**

```javascript
// src/services/cacheService.js (futuro)
class CacheService {
  constructor(ttl = 5 * 60 * 1000) { // 5 minutos default
    this.cache = new Map();
    this.ttl = ttl;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get(key) {
    const cached = this.cache.get(key);
    if (!cached) return null;

    const isExpired = Date.now() - cached.timestamp > this.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }
}

// Integration with API Service
export class CachedPokemonApiService extends PokemonApiService {
  static cache = new CacheService();

  static async getPokemonById(id) {
    const cacheKey = `pokemon-${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return new PokemonDTO(cached);
    }

    const pokemon = await super.getPokemonById(id);
    this.cache.set(cacheKey, pokemon.toInternal());
    
    return pokemon;
  }
}
```

### 3. **Retry Logic**

```javascript
// src/services/retryService.js (futuro)
class RetryService {
  static async withRetry(fn, maxRetries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        
        // Não retenta em erros 4xx (cliente)
        if (error instanceof ApiErrorDTO && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }

    throw lastError;
  }
}

// Usage
const pokemonList = await RetryService.withRetry(
  () => PokemonApiService.getPokemonList(0, 20),
  3,
  1000
);
```

## ✅ Boas Práticas

### 1. **Service Design**
- Métodos estáticos para operations stateless
- Retorno sempre com DTOs
- Tratamento consistente de erros
- Nomes descritivos e específicos

### 2. **Error Handling**
- DTOs específicos para diferentes tipos de erro
- Logging apropriado para debugging
- Re-throw de erros conhecidos
- Fallbacks gracefuls

### 3. **Performance**
- Cache para dados que mudam pouco
- Debounce para buscas em tempo real
- Paginação adequada
- Lazy loading quando apropriado

### 4. **Testing**
- Mock de fetch/HTTP client
- Testes de transformação DTO
- Testes de cenários de erro
- Integração com hooks

## 🚫 Anti-Padrões Evitados

### ❌ Não fazer:
```javascript
// Retornar dados brutos da API
static async getPokemon() {
  const response = await fetch('/api/pokemon');
  return response.json(); // ❌ Sem transformação
}

// Tratamento de erro inconsistente
static async getPokemon() {
  try {
    // API call
  } catch (error) {
    console.log(error); // ❌ Apenas log
    return null; // ❌ Retorno inconsistente
  }
}

// Lógica de negócio no service
static async getPokemon(id) {
  const pokemon = await fetch(`/api/pokemon/${id}`);
  
  // ❌ Lógica de UI no service
  if (pokemon.type === 'fire') {
    pokemon.backgroundColor = 'red';
  }
  
  return pokemon;
}
```

### ✅ Fazer:
```javascript
// Sempre retornar DTOs
static async getPokemon(id) {
  const response = await fetch(`/api/pokemon/${id}`);
  const data = await response.json();
  return new PokemonDTO(data); // ✅
}

// Erro padronizado
static async getPokemon(id) {
  try {
    // API call
  } catch (error) {
    throw new ApiErrorDTO({
      message: error.message,
      status: error.status,
      code: 'POKEMON_ERROR'
    }); // ✅
  }
}

// Service apenas para dados
static async getPokemon(id) {
  const response = await fetch(`/api/pokemon/${id}`);
  const data = await response.json();
  return new PokemonDTO(data); // ✅ Só transformação de dados
}
```

## 📈 Métricas e Monitoramento (Futuro)

### 1. **Performance Tracking**
```javascript
class PerformanceService {
  static async trackApiCall(apiName, fn) {
    const startTime = Date.now();
    
    try {
      const result = await fn();
      const duration = Date.now() - startTime;
      
      console.log(`API ${apiName} completed in ${duration}ms`);
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      console.error(`API ${apiName} failed after ${duration}ms:`, error);
      throw error;
    }
  }
}
```

### 2. **Usage Analytics**
```javascript
class AnalyticsService {
  static trackApiUsage(endpoint, params) {
    // Track API usage for analytics
    console.log('API Usage:', { endpoint, params, timestamp: Date.now() });
  }
}
```
