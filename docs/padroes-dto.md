# 📦 Padrões de DTOs (Data Transfer Objects)

## 📋 Visão Geral

Os **Data Transfer Objects (DTOs)** são uma camada essencial na aplicação que define contratos de dados e gerencia transformações entre diferentes camadas (API, Redux, Componentes). Este documento detalha como os DTOs são implementados, organizados por features e utilizados na aplicação.

## 🏗️ Arquitetura de DTOs por Features

### 1. **Nova Estrutura por Features** ✅

```
src/features/
├── pokemon/
│   └── dto/
│       ├── api/           # DTOs da PokeAPI
│       │   └── index.js   # PokemonDTO, PokemonListResponseDTO, etc.
│       ├── redux/         # DTOs do estado Redux
│       │   └── index.js   # PokemonStateDTO, PokemonFiltersDTO, etc.
│       ├── validation/    # Validadores específicos
│       │   └── index.js   # PokemonValidationDTO, etc.
│       └── index.js       # Barrel exports da feature
├── auth/
│   └── dto/
│       ├── api/           # DTOs de autenticação
│       ├── redux/         # DTOs do estado de auth
│       ├── validation/    # Validadores de auth
│       └── index.js       # Barrel exports da feature
└── shared/
    └── dto/
        ├── redux/         # DTOs de UI global
        ├── validation/    # Validadores genéricos
        ├── factory/       # Factory centralizado
        └── index.js       # Barrel exports compartilhados
```

### 2. **Organização por Responsabilidade**

#### **Pokemon Feature** (`src/features/pokemon/dto/`)

- **API DTOs**: PokemonDTO, PokemonListResponseDTO, PokemonSpritesDTO
- **Redux DTOs**: PokemonStateDTO, PokemonFiltersDTO, PaginationDTO
- **Validation DTOs**: PokemonValidationDTO, PaginationValidationDTO

#### **Auth Feature** (`src/features/auth/dto/`)

- **API DTOs**: ApiErrorDTO, LoginResponseDTO, LoginRequestDTO
- **Redux DTOs**: AuthStateDTO, UserDTO
- **Validation DTOs**: AuthValidationDTO

#### **Shared DTOs** (`src/features/shared/dto/`)

- **Redux DTOs**: UIStateDTO, NotificationDTO, ModalDTO
- **Validation DTOs**: FormValidationDTO, UIValidationDTO
- **Factory**: DTOFactory, DTOUtils, DTO_TYPES

### 2. **Tipos de DTOs**

#### **API DTOs** - Contratos com APIs externas

- Transformam dados vindos da PokéAPI
- Normalizam estruturas de resposta
- Tratam campos opcionais e defaults

#### **Redux DTOs** - Contratos de estado interno

- Definem estrutura do estado da aplicação
- Validam dados antes de armazenar no store
- Facilitam refatoração e tipagem

#### **Validation DTOs** - Validação de dados

- Validam entrada de usuários
- Sanitizam dados de formulários
- Aplicam regras de negócio

## 🎯 Implementação dos DTOs

### 1. **API DTOs - Contratos Externos**

#### **PokemonListResponseDTO**

```javascript
// src/dto/api/index.js
export class PokemonListResponseDTO {
  constructor(data) {
    this.count = data.count || 0;
    this.next = data.next || null;
    this.previous = data.previous || null;
    this.results = (data.results || []).map(
      (item) => new PokemonListItemDTO(item),
    );
  }

  /**
   * Converte para formato interno da aplicação
   * @returns {Object} Objeto no formato Redux
   */
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

#### **PokemonListItemDTO**

```javascript
export class PokemonListItemDTO {
  constructor(data) {
    this.name = data.name || "";
    this.url = data.url || "";
  }

  /**
   * Extrai ID da URL da PokéAPI
   * @returns {number} ID do Pokémon
   */
  getId() {
    const matches = this.url.match(/\/(\d+)\/$/);
    return matches ? parseInt(matches[1], 10) : 0;
  }

  toInternal() {
    return {
      name: this.name,
      url: this.url,
      id: this.getId(),
    };
  }
}
```

#### **PokemonDTO - Completo**

```javascript
export class PokemonDTO {
  constructor(data) {
    this.id = data.id || 0;
    this.name = data.name || "";
    this.height = data.height || 0;
    this.weight = data.weight || 0;
    this.base_experience = data.base_experience || 0;
    this.sprites = new PokemonSpritesDTO(data.sprites || {});
    this.types = (data.types || []).map((type) => new PokemonTypeDTO(type));
    this.stats = (data.stats || []).map((stat) => new PokemonStatDTO(stat));
    this.abilities = (data.abilities || []).map(
      (ability) => new PokemonAbilityDTO(ability),
    );
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
    return this.types.length > 0 ? this.types[0].type.name : "unknown";
  }

  toInternal() {
    return {
      id: this.id,
      name: this.name,
      height: this.height,
      weight: this.weight,
      base_experience: this.base_experience,
      sprites: this.sprites.toInternal(),
      types: this.types.map((type) => type.toInternal()),
      stats: this.stats.map((stat) => stat.toInternal()),
      abilities: this.abilities.map((ability) => ability.toInternal()),
      // Campos calculados
      heightInMeters: this.getHeightInMeters(),
      weightInKg: this.getWeightInKg(),
      primaryType: this.getPrimaryType(),
    };
  }
}
```

#### **DTOs Auxiliares**

```javascript
export class PokemonSpritesDTO {
  constructor(data) {
    this.front_default = data.front_default || "";
    this.front_shiny = data.front_shiny || "";
    this.back_default = data.back_default || "";
  }

  toInternal() {
    return {
      front_default: this.front_default,
      front_shiny: this.front_shiny,
      back_default: this.back_default,
    };
  }
}

export class PokemonTypeDTO {
  constructor(data) {
    this.slot = data.slot || 0;
    this.type = {
      name: data.type?.name || "",
      url: data.type?.url || "",
    };
  }

  toInternal() {
    return {
      slot: this.slot,
      type: this.type,
    };
  }
}
```

#### **Error DTO**

```javascript
export class ApiErrorDTO extends Error {
  constructor(data) {
    super(data.message || "Erro na API");
    this.name = "ApiErrorDTO";
    this.status = data.status || 0;
    this.code = data.code || "UNKNOWN_ERROR";
    this.details = data.details || null;
  }

  toInternal() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
    };
  }
}
```

### 2. **Redux DTOs - Estado Interno**

#### **AuthStateDTO**

```javascript
// src/dto/redux/index.js
export class AuthStateDTO {
  constructor(data = {}) {
    this.user = data.user ? new UserDTO(data.user) : null;
    this.isAuthenticated = Boolean(data.isAuthenticated);
    this.isLoading = Boolean(data.isLoading);
    this.error = data.error || null;
  }

  toPlainObject() {
    return {
      user: this.user?.toPlainObject() || null,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error,
    };
  }
}

export class UserDTO {
  constructor(data = {}) {
    this.id = data.id || "";
    this.email = data.email || "";
    this.name = data.name || "";
    this.avatar = data.avatar || null;
  }

  toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
    };
  }
}
```

#### **PokemonStateDTO**

```javascript
export class PokemonStateDTO {
  constructor(data = {}) {
    this.list = (data.list || []).map((item) =>
      item instanceof Object ? item : new PokemonListItemDTO(item),
    );
    this.selected = data.selected ? new PokemonDTO(data.selected) : null;
    this.filters = new PokemonFiltersDTO(data.filters || {});
    this.isLoading = Boolean(data.isLoading);
    this.error = data.error || null;
    this.pagination = new PaginationDTO(data.pagination || {});
  }

  toPlainObject() {
    return {
      list: this.list.map((item) => item.toInternal?.() || item),
      selected: this.selected?.toInternal() || null,
      filters: this.filters.toPlainObject(),
      isLoading: this.isLoading,
      error: this.error,
      pagination: this.pagination.toPlainObject(),
    };
  }
}
```

#### **PokemonFiltersDTO**

```javascript
export class PokemonFiltersDTO {
  constructor(data = {}) {
    this.search = data.search || "";
    this.type = data.type || "";
    this.sortBy = data.sortBy || "name";
    this.sortOrder = data.sortOrder || "asc";
  }

  /**
   * Valida se os filtros são válidos
   * @returns {boolean} True se válidos
   */
  isValid() {
    const validSortBy = ["name", "id", "height", "weight"];
    const validSortOrder = ["asc", "desc"];

    return (
      validSortBy.includes(this.sortBy) &&
      validSortOrder.includes(this.sortOrder)
    );
  }

  toPlainObject() {
    return {
      search: this.search,
      type: this.type,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
    };
  }
}
```

## 🏭 Factory Pattern

### 1. **DTOFactory - Criação Centralizada**

```javascript
// src/dto/index.js
export class DTOFactory {
  /**
   * Cria um DTO baseado no tipo e dados fornecidos
   * @param {string} type - Tipo do DTO
   * @param {Object} data - Dados para criar o DTO
   * @returns {Object} Instância do DTO
   */
  static create(type, data) {
    const dtoMap = {
      // API DTOs
      "api.pokemon": () => new PokemonDTO(data),
      "api.pokemonList": () => new PokemonListResponseDTO(data),
      "api.pokemonListItem": () => new PokemonListItemDTO(data),
      "api.error": () => new ApiErrorDTO(data),

      // Redux DTOs
      "redux.authState": () => new AuthStateDTO(data),
      "redux.user": () => new UserDTO(data),
      "redux.pokemonState": () => new PokemonStateDTO(data),
      "redux.pokemonFilters": () => new PokemonFiltersDTO(data),

      // Validation DTOs
      "validation.auth": () => new AuthValidationDTO(data),

      // Default
      default: () => data,
    };

    const creator = dtoMap[type] || dtoMap["default"];
    return creator();
  }

  /**
   * Cria múltiplos DTOs de uma lista
   * @param {string} type - Tipo do DTO
   * @param {Array} dataList - Lista de dados
   * @returns {Array} Lista de instâncias DTO
   */
  static createList(type, dataList) {
    if (!Array.isArray(dataList)) {
      return [];
    }

    return dataList.map((data) => this.create(type, data));
  }
}
```

### 2. **DTOUtils - Utilitários**

```javascript
export class DTOUtils {
  /**
   * Converte DTO para objeto simples
   * @param {Object} dto - Instância do DTO
   * @returns {Object} Objeto simples
   */
  static toPlainObject(dto) {
    if (typeof dto.toPlainObject === "function") {
      return dto.toPlainObject();
    }

    if (typeof dto.toInternal === "function") {
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

    return dtoList.map((dto) => this.toPlainObject(dto));
  }

  /**
   * Clona um DTO
   * @param {Object} dto - DTO para clonar
   * @returns {Object} Nova instância DTO
   */
  static clone(dto) {
    const plainObject = this.toPlainObject(dto);
    return { ...plainObject };
  }

  /**
   * Verifica se dois DTOs são iguais
   * @param {Object} dto1 - Primeiro DTO
   * @param {Object} dto2 - Segundo DTO
   * @returns {boolean} True se iguais
   */
  static equals(dto1, dto2) {
    const obj1 = this.toPlainObject(dto1);
    const obj2 = this.toPlainObject(dto2);

    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }
}
```

## 🔄 Uso dos DTOs na Nova Arquitetura

### 1. **Importando DTOs por Feature**

```javascript
// ✅ Importar DTOs da feature Pokemon
import { PokemonDTO, PokemonValidationDTO } from "../features/pokemon";

// ✅ Importar DTOs de Auth
import { AuthStateDTO, UserDTO } from "../features/auth";

// ✅ Importar DTOs compartilhados
import { UIStateDTO, DTOFactory } from "../features/shared";

// ✅ Usando o Factory
import { DTOFactory, DTO_TYPES } from "../features/shared";

const pokemon = DTOFactory.create(DTO_TYPES.POKEMON.API.POKEMON, apiData);
```

### 2. **Em Services**

```javascript
// src/features/pokemon/services/pokemonApi.js
import { PokemonListResponseDTO, PokemonDTO, ApiErrorDTO } from "../dto";

export class PokemonApiService {
  static async getPokemonList(offset = 0, limit = 20) {
    try {
      const response = await fetch(
        `${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
      );

      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `Erro ao buscar lista de Pokémon: ${response.statusText}`,
          status: response.status,
          code: "POKEMON_LIST_ERROR",
        });
      }

      const data = await response.json();
      return new PokemonListResponseDTO(data); // ✅ DTO de saída
    } catch (error) {
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      throw new ApiErrorDTO({
        message: error.message || "Erro ao buscar Pokémon",
        status: 0,
        code: "NETWORK_ERROR",
      });
    }
  }
}
```

### 3. **Em Hooks**

```javascript
// src/features/pokemon/hooks/usePokemon.js
import { PokemonApiService } from "../services/pokemonApi.js";

export const usePokemon = () => {
  const fetchPokemonList = useCallback(
    async (page = 1, limit = 20) => {
      try {
        const response = await PokemonApiService.getPokemonList(offset, limit);

        // ✅ Transformação com DTO
        const internalData = response.toInternal();

        dispatch(setPokemonList(internalData.results));
      } catch (error) {
        let errorMessage = "Erro ao carregar Pokémon";

        if (error instanceof ApiErrorDTO) {
          errorMessage = error.message;
        }

        dispatch(setError(errorMessage));
      }
    },
    [dispatch],
  );
};
```

### 4. **Com Factory Pattern**

```javascript
import {
  DTOFactory,
  DTO_TYPES,
  PokemonValidationDTO,
} from "../features/pokemon";

const result = DTOFactory.createWithValidation(
  DTO_TYPES.POKEMON.API.POKEMON,
  apiData,
  PokemonValidationDTO.validatePokemon,
);

if (result.isValid) {
  const pokemon = result.dto;
  // Usar pokemon validado
} else {
  console.error("Erros de validação:", result.errors);
}
```

### 5. **Em Componentes**

```javascript
// Uso indireto através de hooks por feature
import { AuthValidationDTO } from "../features/auth";

export const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "", // gitleaks:allow
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    // ✅ Validação com DTO da feature
    const validationDTO = new AuthValidationDTO(formData);
    const validation = validationDTO.validate();

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    // Prosseguir com login
    const result = await login(formData.email, formData.password); // gitleaks:allow
  };
};
```

## ✅ Benefícios dos DTOs

### 1. **Contratos Claros**

- Define estrutura de dados esperada
- Facilita refatoração e manutenção
- Torna mudanças de API mais seguras

### 2. **Transformação de Dados**

- Normaliza dados entre diferentes fontes
- Adiciona campos calculados
- Padroniza formatos

### 3. **Validação**

- Valida dados na entrada
- Aplica regras de negócio
- Previne dados inválidos no estado

### 4. **Testabilidade**

- Fácil de mockar
- Lógica isolada
- Testes unitários simples

## 🚫 Anti-Padrões Evitados

### ❌ Não fazer:

```javascript
// Usar dados da API diretamente no Redux
dispatch(setPokemonList(apiResponse.results)); // ❌

// Validação esparsa nos componentes
if (!email || !password) {
  // gitleaks:allow
  /* ... */
} // ❌

// Transformações manuais repetitivas
const pokemon = {
  ...apiPokemon,
  heightInMeters: apiPokemon.height / 10,
}; // ❌
```

### ✅ Fazer:

```javascript
// Usar DTOs para transformação
const pokemonDTO = new PokemonListResponseDTO(apiResponse);
dispatch(setPokemonList(pokemonDTO.toInternal().results)); // ✅

// Validação centralizada em DTOs
const validation = new AuthValidationDTO(formData).validate(); // ✅

// Transformações encapsuladas
const pokemonDTO = new PokemonDTO(apiPokemon);
const internalData = pokemonDTO.toInternal(); // ✅
```

## 🧪 Testabilidade

### 1. **Testes de DTOs**

```javascript
describe("PokemonDTO", () => {
  it("should calculate height in meters correctly", () => {
    const dto = new PokemonDTO({ height: 40 });
    expect(dto.getHeightInMeters()).toBe(4);
  });

  it("should handle missing data gracefully", () => {
    const dto = new PokemonDTO({});
    expect(dto.name).toBe("");
    expect(dto.height).toBe(0);
  });
});
```

### 2. **Mocking DTOs**

```javascript
const mockPokemonDTO = new PokemonDTO({
  id: 25,
  name: "pikachu",
  height: 4,
  types: [{ slot: 1, type: { name: "electric" } }],
});

// Fácil de usar em testes
expect(mockPokemonDTO.getPrimaryType()).toBe("electric");
```
