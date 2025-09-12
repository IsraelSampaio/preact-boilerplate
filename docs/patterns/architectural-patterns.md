# 🏗️ Architectural Patterns

This document describes the architectural patterns used throughout the Pokémon App project.

## 📋 Table of Contents

- [Feature-Based Architecture](#feature-based-architecture)
- [Layered Architecture](#layered-architecture)
- [Dependency Injection Pattern](#dependency-injection-pattern)
- [Component Architecture](#component-architecture)
- [Module Architecture](#module-architecture)

## Feature-Based Architecture

### Overview

The project follows a **Feature-Based Architecture** where code is organized by business features rather than technical layers. This approach promotes scalability, maintainability, and team collaboration.

### Structure

```
src/
├── features/
│   ├── auth/              # Authentication feature
│   │   ├── components/    # Feature-specific components
│   │   │   ├── LoginForm.jsx
│   │   │   └── __tests__/
│   │   ├── hooks/         # Feature-specific hooks
│   │   │   └── useAuth.js
│   │   ├── services/      # Feature-specific services
│   │   │   └── authService.js
│   │   ├── types/         # Feature-specific types
│   │   │   └── auth.js
│   │   └── index.js       # Feature exports
│   └── pokemon/           # Pokemon feature
│       ├── components/
│       │   ├── PokemonCard.jsx
│       │   ├── PokemonList.jsx
│       │   └── PokemonFilters.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   └── PokemonListPage.jsx
│       ├── hooks/
│       │   └── usePokemon.js
│       └── services/
│           └── pokemonService.js
├── shared/                # Shared components and utilities
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
└── core/                  # Core application logic
    ├── store/
    ├── api/
    └── config/
```

### Benefits

- **Scalability**: Easy to add new features without affecting existing ones
- **Maintainability**: Related code is co-located and easy to find
- **Team Collaboration**: Teams can work on different features independently
- **Code Reusability**: Shared components in common directories
- **Testing**: Feature-specific tests are easier to organize and maintain

### Implementation Example

```javascript
// features/pokemon/index.js - Feature exports
export { PokemonCard } from './components/PokemonCard.jsx';
export { PokemonList } from './components/PokemonList.jsx';
export { PokemonListPage } from './pages/PokemonListPage.jsx';
export { usePokemon } from './hooks/usePokemon.js';

// Usage in other parts of the app
import { PokemonCard, usePokemon } from '@/features/pokemon';
```

### Guidelines

1. **Feature Boundaries**: Keep features independent and avoid cross-feature dependencies
2. **Shared Code**: Place truly shared code in the `shared` directory
3. **Feature Index**: Always provide an index.js file to export public APIs
4. **Documentation**: Each feature should have its own README.md
5. **Testing**: Keep feature tests within the feature directory

## Layered Architecture

### Overview

Within each feature, we follow a layered architecture that separates concerns into distinct layers.

### Layers

```
┌─────────────────────────────┐
│     Presentation Layer      │ ← Components, Pages, UI Logic
├─────────────────────────────┤
│    Business Logic Layer     │ ← Hooks, Services, Domain Logic
├─────────────────────────────┤
│      Data Access Layer      │ ← API Services, DTOs, Cache
├─────────────────────────────┤
│    Infrastructure Layer     │ ← External APIs, Storage, Config
└─────────────────────────────┘
```

### Layer Responsibilities

#### Presentation Layer
- **React Components**: UI components and pages
- **UI State**: Local component state and UI-specific logic
- **Event Handling**: User interaction handling
- **Styling**: Component-specific styles

```javascript
// Presentation Layer Example
export const PokemonCard = ({ pokemon, onFavorite }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = () => {
    onFavorite(pokemon);
  };
  
  return (
    <Card 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <CardContent>
        <Typography variant="h6">{pokemon.name}</Typography>
      </CardContent>
    </Card>
  );
};
```

#### Business Logic Layer
- **Custom Hooks**: Encapsulate business logic
- **Domain Services**: Business rule implementations
- **State Management**: Application state logic
- **Validation**: Business rule validation

```javascript
// Business Logic Layer Example
export const usePokemon = () => {
  const dispatch = useAppDispatch();
  const { pokemonList, isLoading } = useAppSelector(state => state.pokemon);
  
  const fetchPokemonList = useCallback(async (filters) => {
    dispatch(setLoading(true));
    try {
      const response = await PokemonApiService.getPokemonList(filters);
      const pokemonData = response.toInternal();
      dispatch(setPokemonList(pokemonData));
    } catch (error) {
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);
  
  return { pokemonList, isLoading, fetchPokemonList };
};
```

#### Data Access Layer
- **API Services**: External API communication
- **DTOs**: Data transformation objects
- **Caching**: Data caching strategies
- **Local Storage**: Persistent storage

```javascript
// Data Access Layer Example
export class PokemonApiService {
  static async getPokemonList(offset = 0, limit = 20) {
    try {
      const response = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `Error fetching Pokemon list: ${response.statusText}`,
          status: response.status,
          code: 'POKEMON_LIST_ERROR'
        });
      }
      const data = await response.json();
      return new PokemonListResponseDTO(data);
    } catch (error) {
      if (error instanceof ApiErrorDTO) throw error;
      throw new ApiErrorDTO({
        message: error.message || 'Network error',
        status: 0,
        code: 'NETWORK_ERROR'
      });
    }
  }
}
```

#### Infrastructure Layer
- **Configuration**: Environment and app configuration
- **External Services**: Third-party service integrations
- **Utilities**: Cross-cutting utilities
- **Logging**: Application logging

```javascript
// Infrastructure Layer Example
export const config = {
  apiUrl: process.env.VITE_API_BASE_URL || 'https://pokeapi.co/api/v2',
  appName: process.env.VITE_APP_TITLE || 'Pokémon App',
  environment: process.env.NODE_ENV || 'development',
};

export const logger = {
  info: (message, data) => {
    if (config.environment === 'development') {
      console.log(`ℹ️ ${message}`, data);
    }
  },
  error: (message, error) => {
    console.error(`❌ ${message}`, error);
  },
};
```

## Dependency Injection Pattern

### Overview

We use dependency injection to make our code more testable and flexible by injecting dependencies rather than hard-coding them.

### Implementation

#### Service Injection
```javascript
// Service with injected dependencies
export class PokemonService {
  constructor(apiService = PokemonApiService, cache = new Map()) {
    this.apiService = apiService;
    this.cache = cache;
  }
  
  async getPokemon(id) {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }
    
    const pokemon = await this.apiService.getPokemonById(id);
    this.cache.set(id, pokemon);
    return pokemon;
  }
}
```

#### Hook Injection
```javascript
// Hook with optional dependency injection
export const usePokemon = (apiService = PokemonApiService) => {
  const [pokemonList, setPokemonList] = useState([]);
  
  const fetchPokemon = useCallback(async () => {
    const response = await apiService.getPokemonList();
    setPokemonList(response.toInternal());
  }, [apiService]);
  
  return { pokemonList, fetchPokemon };
};
```

#### Testing with Injection
```javascript
// Easy mocking in tests
describe('usePokemon', () => {
  it('fetches pokemon list', async () => {
    const mockApiService = {
      getPokemonList: vi.fn().mockResolvedValue(mockResponse)
    };
    
    const { result } = renderHook(() => usePokemon(mockApiService));
    
    await act(async () => {
      await result.current.fetchPokemon();
    });
    
    expect(mockApiService.getPokemonList).toHaveBeenCalled();
    expect(result.current.pokemonList).toEqual(expectedData);
  });
});
```

## Component Architecture

### Overview

Our component architecture follows React best practices with a focus on composition, reusability, and maintainability.

### Component Types

#### 1. Presentational Components
Pure components that only render UI based on props.

```javascript
/**
 * Presentational component - pure UI
 */
export const PokemonCardPresenter = ({ 
  pokemon, 
  isFavorite, 
  onFavorite, 
  onSelect 
}) => (
  <Card className="pokemon-card">
    <CardContent>
      <Typography variant="h6">{pokemon.name}</Typography>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <Button 
        onClick={() => onFavorite(pokemon)}
        color={isFavorite ? 'secondary' : 'primary'}
      >
        {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
      </Button>
    </CardContent>
  </Card>
);
```

#### 2. Container Components
Components that manage state and business logic.

```javascript
/**
 * Container component - logic and state
 */
export const PokemonCard = ({ pokemon }) => {
  const { favorites, addFavorite, removeFavorite } = useFavorites();
  const isFavorite = favorites.includes(pokemon.id);
  
  const handleFavorite = useCallback(() => {
    if (isFavorite) {
      removeFavorite(pokemon.id);
    } else {
      addFavorite(pokemon.id);
    }
  }, [pokemon.id, isFavorite, addFavorite, removeFavorite]);
  
  return (
    <PokemonCardPresenter
      pokemon={pokemon}
      isFavorite={isFavorite}
      onFavorite={handleFavorite}
    />
  );
};
```

#### 3. Compound Components
Components that work together as a system.

```javascript
// Parent component
const PokemonCard = ({ children, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <PokemonCardContext.Provider value={{ isExpanded, setIsExpanded }}>
      <Card {...props}>
        {children}
      </Card>
    </PokemonCardContext.Provider>
  );
};

// Sub-components
PokemonCard.Header = ({ children }) => (
  <CardHeader>{children}</CardHeader>
);

PokemonCard.Content = ({ children }) => (
  <CardContent>{children}</CardContent>
);

PokemonCard.Actions = ({ children }) => (
  <CardActions>{children}</CardActions>
);

// Usage
<PokemonCard>
  <PokemonCard.Header>
    <Typography variant="h6">Pikachu</Typography>
  </PokemonCard.Header>
  <PokemonCard.Content>
    <PokemonStats stats={stats} />
  </PokemonCard.Content>
  <PokemonCard.Actions>
    <Button>View Details</Button>
  </PokemonCard.Actions>
</PokemonCard>
```

#### 4. Higher-Order Components (HOCs)
Components that enhance other components with additional functionality.

```javascript
/**
 * HOC for adding loading state
 */
export const withLoading = (WrappedComponent) => {
  return ({ isLoading, ...props }) => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
};

// Usage
const PokemonListWithLoading = withLoading(PokemonList);

<PokemonListWithLoading 
  isLoading={isLoading}
  pokemonList={pokemonList}
/>
```

### Component Composition Guidelines

1. **Single Responsibility**: Each component should have one clear purpose
2. **Props Interface**: Define clear and minimal prop interfaces
3. **Composition over Inheritance**: Use composition to build complex UIs
4. **Reusability**: Design components to be reusable across features
5. **Performance**: Use memoization for expensive operations

## Module Architecture

### Overview

Our module architecture defines how different parts of the application interact and depend on each other.

### Module Structure

```
src/
├── core/              # Core application modules
│   ├── store/         # Global state management
│   ├── router/        # Application routing
│   ├── api/           # API configuration
│   └── config/        # Application configuration
├── shared/            # Shared modules
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Reusable custom hooks
│   ├── utils/         # Utility functions
│   └── constants/     # Application constants
├── features/          # Feature modules
│   ├── auth/          # Authentication feature
│   └── pokemon/       # Pokemon feature
└── infrastructure/    # Infrastructure modules
    ├── http/          # HTTP client configuration
    ├── storage/       # Storage utilities
    └── monitoring/    # Application monitoring
```

### Module Dependencies

```
┌─────────────┐
│  Features   │ ← Can depend on shared and core
├─────────────┤
│   Shared    │ ← Can depend on core only
├─────────────┤
│    Core     │ ← No dependencies on other modules
├─────────────┤
│Infrastructure│ ← Can depend on core only
└─────────────┘
```

### Dependency Rules

1. **Features** can depend on `shared` and `core` modules
2. **Shared** modules can only depend on `core` modules
3. **Core** modules have no dependencies on other application modules
4. **Infrastructure** modules can depend on `core` only
5. **No circular dependencies** between modules

### Module Communication

#### Event-Based Communication
```javascript
// Event emitter for module communication
export const eventBus = new EventTarget();

// Feature A emits event
eventBus.dispatchEvent(new CustomEvent('pokemon:selected', {
  detail: { pokemonId: 25 }
}));

// Feature B listens to event
useEffect(() => {
  const handlePokemonSelected = (event) => {
    console.log('Pokemon selected:', event.detail.pokemonId);
  };
  
  eventBus.addEventListener('pokemon:selected', handlePokemonSelected);
  
  return () => {
    eventBus.removeEventListener('pokemon:selected', handlePokemonSelected);
  };
}, []);
```

#### State-Based Communication
```javascript
// Global state for module communication
const globalState = {
  selectedPokemon: null,
  user: null,
  theme: 'light'
};

// Modules can read/write to global state
export const useGlobalState = () => {
  const { selectedPokemon, user, theme } = useAppSelector(state => ({
    selectedPokemon: state.pokemon.selected,
    user: state.auth.user,
    theme: state.ui.theme
  }));
  
  return { selectedPokemon, user, theme };
};
```

## Best Practices

### 1. Architecture Guidelines

- **Keep it Simple**: Don't over-engineer the architecture
- **Consistent Structure**: Follow the same patterns across features
- **Clear Boundaries**: Maintain clear boundaries between layers and modules
- **Documentation**: Document architectural decisions and patterns
- **Evolution**: Allow the architecture to evolve as the project grows

### 2. Code Organization

- **Co-location**: Keep related code close together
- **Separation of Concerns**: Separate UI, business logic, and data access
- **Naming Conventions**: Use consistent naming across the application
- **File Structure**: Maintain consistent file and folder structure
- **Exports**: Use index files to control public APIs

### 3. Dependency Management

- **Minimize Dependencies**: Keep dependencies between modules minimal
- **Inject Dependencies**: Use dependency injection for testability
- **Abstract External Dependencies**: Create abstractions for external services
- **Version Compatibility**: Ensure dependency versions are compatible
- **Regular Updates**: Keep dependencies updated and secure

### 4. Performance Considerations

- **Lazy Loading**: Load modules and components on demand
- **Code Splitting**: Split code by features and routes
- **Bundle Analysis**: Regularly analyze bundle size and composition
- **Caching**: Implement appropriate caching strategies
- **Monitoring**: Monitor application performance in production

---

This architectural approach ensures our application is scalable, maintainable, and testable while providing clear guidelines for development teams.
