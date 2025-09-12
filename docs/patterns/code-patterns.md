# 💻 Code Patterns

This document describes the code patterns and best practices used throughout the Pokémon App project.

## 📋 Table of Contents

- [Component Patterns](#component-patterns)
- [Hook Patterns](#hook-patterns)
- [Error Handling Patterns](#error-handling-patterns)
- [Performance Patterns](#performance-patterns)
- [Async Patterns](#async-patterns)
- [Functional Patterns](#functional-patterns)

## Component Patterns

### 1. Functional Component Pattern

#### Basic Structure
```javascript
/**
 * Standard functional component with hooks
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @param {Function} [props.onAction] - Optional action callback
 */
export const ComponentName = ({ title, onAction }) => {
  // State hooks
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  
  // Custom hooks
  const { user } = useAuth();
  const { theme } = useTheme();
  
  // Event handlers
  const handleClick = useCallback(() => {
    if (onAction) {
      onAction();
    }
  }, [onAction]);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, []);
  
  // Render
  return (
    <div className="component-name">
      <h2>{title}</h2>
      {isLoading ? <Loading /> : <Content data={data} />}
      <button onClick={handleClick}>Action</button>
    </div>
  );
};
```

#### Guidelines
- Use functional components by default
- Group hooks at the top of the component
- Use JSDoc for prop documentation
- Keep components focused on a single responsibility
- Extract complex logic into custom hooks

### 2. Container/Presenter Pattern

#### Container Component (Logic)
```javascript
/**
 * Container component handling business logic
 */
export const PokemonListContainer = () => {
  const { 
    pokemonList, 
    isLoading, 
    error, 
    fetchPokemon,
    searchPokemon 
  } = usePokemon();
  
  const { favorites, toggleFavorite } = useFavorites();
  
  const handleSearch = useCallback((query) => {
    searchPokemon(query);
  }, [searchPokemon]);
  
  const handleFavorite = useCallback((pokemon) => {
    toggleFavorite(pokemon.id);
  }, [toggleFavorite]);
  
  return (
    <PokemonListPresenter
      pokemonList={pokemonList}
      favorites={favorites}
      isLoading={isLoading}
      error={error}
      onSearch={handleSearch}
      onFavorite={handleFavorite}
      onRefresh={fetchPokemon}
    />
  );
};
```

#### Presenter Component (UI)
```javascript
/**
 * Presenter component focusing on UI rendering
 */
export const PokemonListPresenter = ({
  pokemonList,
  favorites,
  isLoading,
  error,
  onSearch,
  onFavorite,
  onRefresh
}) => {
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRefresh} />;
  }
  
  return (
    <div className="pokemon-list">
      <SearchBar onSearch={onSearch} />
      
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Grid container spacing={2}>
          {pokemonList.map(pokemon => (
            <Grid item key={pokemon.id} xs={12} sm={6} md={4}>
              <PokemonCard
                pokemon={pokemon}
                isFavorite={favorites.includes(pokemon.id)}
                onFavorite={() => onFavorite(pokemon)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};
```

### 3. Compound Component Pattern

#### Parent Component with Context
```javascript
const PokemonCardContext = createContext();

export const PokemonCard = ({ children, pokemon, ...props }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const contextValue = {
    pokemon,
    isExpanded,
    setIsExpanded,
    isHovered,
    setIsHovered,
  };
  
  return (
    <PokemonCardContext.Provider value={contextValue}>
      <Card 
        {...props}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`pokemon-card ${isExpanded ? 'expanded' : ''}`}
      >
        {children}
      </Card>
    </PokemonCardContext.Provider>
  );
};

// Sub-components
PokemonCard.Image = ({ className, ...props }) => {
  const { pokemon, isHovered } = useContext(PokemonCardContext);
  
  return (
    <img
      {...props}
      src={isHovered ? pokemon.sprites.front_shiny : pokemon.sprites.front_default}
      alt={pokemon.name}
      className={`pokemon-card__image ${className || ''}`}
    />
  );
};

PokemonCard.Title = ({ className, ...props }) => {
  const { pokemon } = useContext(PokemonCardContext);
  
  return (
    <Typography
      {...props}
      variant="h6"
      className={`pokemon-card__title ${className || ''}`}
    >
      {pokemon.name}
    </Typography>
  );
};

PokemonCard.Types = ({ className, ...props }) => {
  const { pokemon } = useContext(PokemonCardContext);
  
  return (
    <div className={`pokemon-card__types ${className || ''}`} {...props}>
      {pokemon.types.map(type => (
        <Chip
          key={type.type.name}
          label={type.type.name}
          size="small"
          className={`pokemon-type pokemon-type--${type.type.name}`}
        />
      ))}
    </div>
  );
};

PokemonCard.Stats = ({ className, ...props }) => {
  const { pokemon, isExpanded } = useContext(PokemonCardContext);
  
  if (!isExpanded) return null;
  
  return (
    <div className={`pokemon-card__stats ${className || ''}`} {...props}>
      <Typography variant="body2">Height: {pokemon.height / 10}m</Typography>
      <Typography variant="body2">Weight: {pokemon.weight / 10}kg</Typography>
    </div>
  );
};

PokemonCard.Actions = ({ children, className, ...props }) => {
  return (
    <div className={`pokemon-card__actions ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

// Usage
<PokemonCard pokemon={pokemon}>
  <PokemonCard.Image />
  <PokemonCard.Title />
  <PokemonCard.Types />
  <PokemonCard.Stats />
  <PokemonCard.Actions>
    <Button onClick={handleFavorite}>
      {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
    </Button>
    <Button onClick={handleViewDetails}>
      View Details
    </Button>
  </PokemonCard.Actions>
</PokemonCard>
```

### 4. Render Props Pattern

```javascript
/**
 * Render props pattern for flexible data fetching
 */
export const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return children({ data, loading, error });
};

// Usage
<DataFetcher url="/api/pokemon">
  {({ data, loading, error }) => {
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorDisplay error={error} />;
    return <PokemonList pokemonList={data} />;
  }}
</DataFetcher>
```

## Hook Patterns

### 1. Custom Hook Pattern

#### Data Fetching Hook
```javascript
/**
 * Custom hook for data fetching with caching
 * @param {string} url - API endpoint URL
 * @param {Object} options - Fetch options
 */
export const useApi = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [url, options]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);
  
  return { data, loading, error, refetch };
};
```

#### State Management Hook
```javascript
/**
 * Custom hook for local storage state
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value
 */
export const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return defaultValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  return [storedValue, setValue];
};
```

### 2. Hook Composition Pattern

```javascript
/**
 * Composed hook combining multiple hooks
 */
export const useAuthenticatedPokemon = () => {
  const { isAuthenticated, user } = useAuth();
  const { pokemonList, loading, error, fetchPokemon } = usePokemon();
  const [favorites, setFavorites] = useLocalStorage('favorites', []);
  
  // Only fetch if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchPokemon();
    }
  }, [isAuthenticated, fetchPokemon]);
  
  const toggleFavorite = useCallback((pokemonId) => {
    setFavorites(prev => 
      prev.includes(pokemonId)
        ? prev.filter(id => id !== pokemonId)
        : [...prev, pokemonId]
    );
  }, [setFavorites]);
  
  return {
    pokemonList,
    favorites,
    loading,
    error,
    isAuthenticated,
    user,
    toggleFavorite,
    refetch: fetchPokemon,
  };
};
```

### 3. Hook with Reducer Pattern

```javascript
/**
 * Hook using reducer for complex state management
 */
const initialState = {
  data: null,
  loading: false,
  error: null,
  filters: {},
  pagination: { page: 1, limit: 20 },
};

const pokemonReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { 
        ...state, 
        loading: false, 
        data: action.payload,
        error: null 
      };
    case 'FETCH_ERROR':
      return { 
        ...state, 
        loading: false, 
        error: action.payload 
      };
    case 'SET_FILTERS':
      return { 
        ...state, 
        filters: { ...state.filters, ...action.payload },
        pagination: { ...state.pagination, page: 1 } // Reset page
      };
    case 'SET_PAGE':
      return { 
        ...state, 
        pagination: { ...state.pagination, page: action.payload }
      };
    default:
      return state;
  }
};

export const usePokemonWithReducer = () => {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);
  
  const fetchPokemon = useCallback(async () => {
    dispatch({ type: 'FETCH_START' });
    
    try {
      const offset = (state.pagination.page - 1) * state.pagination.limit;
      const response = await PokemonApiService.getPokemonList({
        offset,
        limit: state.pagination.limit,
        ...state.filters
      });
      
      dispatch({ type: 'FETCH_SUCCESS', payload: response.toInternal() });
    } catch (error) {
      dispatch({ type: 'FETCH_ERROR', payload: error.message });
    }
  }, [state.pagination, state.filters]);
  
  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);
  
  const setPage = useCallback((page) => {
    dispatch({ type: 'SET_PAGE', payload: page });
  }, []);
  
  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);
  
  return {
    ...state,
    setFilters,
    setPage,
    refetch: fetchPokemon,
  };
};
```

## Error Handling Patterns

### 1. Error Boundary Pattern

```javascript
/**
 * Error boundary component for catching React errors
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onReset={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }
    
    return this.props.children;
  }
}

// Error fallback component
const ErrorFallback = ({ error, errorInfo, onReset }) => (
  <Box 
    display="flex" 
    flexDirection="column" 
    alignItems="center" 
    justifyContent="center" 
    minHeight="400px"
    p={4}
  >
    <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
      <AlertTitle>Something went wrong</AlertTitle>
      <Typography variant="body2">
        {error?.message || 'An unexpected error occurred'}
      </Typography>
    </Alert>
    
    <Button variant="contained" onClick={onReset} sx={{ mt: 2 }}>
      Try Again
    </Button>
    
    {process.env.NODE_ENV === 'development' && (
      <details style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>
        <summary>Error details (development only)</summary>
        {error && error.toString()}
        <br />
        {errorInfo.componentStack}
      </details>
    )}
  </Box>
);

// Usage
<ErrorBoundary>
  <PokemonListPage />
</ErrorBoundary>
```

### 2. API Error Handling Pattern

```javascript
/**
 * Centralized API error handling
 */
export const handleApiError = (error) => {
  if (error instanceof ApiErrorDTO) {
    // Handle known API errors
    switch (error.code) {
      case 'POKEMON_NOT_FOUND':
        return 'Pokémon not found. Please try a different search.';
      case 'RATE_LIMIT_EXCEEDED':
        return 'Too many requests. Please wait and try again.';
      case 'NETWORK_ERROR':
        return 'Network connection failed. Please check your internet connection.';
      default:
        return error.message || 'An API error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
};

// Usage in components
export const usePokemonWithErrorHandling = () => {
  const [error, setError] = useState(null);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const fetchPokemon = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await PokemonApiService.getPokemonById(id);
      setPokemon(result.toInternal());
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { pokemon, loading, error, fetchPokemon };
};
```

### 3. Form Validation Error Pattern

```javascript
/**
 * Form validation with comprehensive error handling
 */
export const useFormValidation = (validationSchema) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const validateField = useCallback((name, value) => {
    const fieldSchema = validationSchema[name];
    if (!fieldSchema) return null;
    
    const validation = fieldSchema.validate(value);
    return validation.isValid ? null : validation.error;
  }, [validationSchema]);
  
  const validateForm = useCallback((values) => {
    const newErrors = {};
    
    Object.keys(validationSchema).forEach(field => {
      const error = validateField(field, values[field]);
      if (error) {
        newErrors[field] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [validationSchema, validateField]);
  
  const handleFieldChange = useCallback((name, value) => {
    if (touched[name]) {
      const fieldError = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: fieldError
      }));
    }
  }, [touched, validateField]);
  
  const handleFieldBlur = useCallback((name, value) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const fieldError = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: fieldError
    }));
  }, [validateField]);
  
  return {
    errors,
    validateForm,
    handleFieldChange,
    handleFieldBlur,
  };
};
```

## Performance Patterns

### 1. Memoization Pattern

```javascript
/**
 * Component memoization for expensive components
 */
export const ExpensivePokemonCard = memo(({ pokemon, onFavorite }) => {
  // Expensive rendering logic here
  return (
    <Card>
      <ComplexVisualization data={pokemon.stats} />
      <Button onClick={() => onFavorite(pokemon)}>
        Add to Favorites
      </Button>
    </Card>
  );
}, (prevProps, nextProps) => {
  // Custom comparison function
  return (
    prevProps.pokemon.id === nextProps.pokemon.id &&
    prevProps.pokemon.stats === nextProps.pokemon.stats
  );
});

/**
 * Callback memoization
 */
export const PokemonList = ({ pokemonList, onFavorite }) => {
  // Memoize callback to prevent unnecessary re-renders
  const handleFavorite = useCallback((pokemon) => {
    onFavorite(pokemon.id);
  }, [onFavorite]);
  
  // Memoize expensive calculations
  const sortedPokemon = useMemo(() => {
    return pokemonList
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [pokemonList]);
  
  return (
    <div>
      {sortedPokemon.map(pokemon => (
        <ExpensivePokemonCard
          key={pokemon.id}
          pokemon={pokemon}
          onFavorite={handleFavorite}
        />
      ))}
    </div>
  );
};
```

### 2. Lazy Loading Pattern

```javascript
/**
 * Component lazy loading
 */
const LazyPokemonDetails = lazy(() => 
  import('./PokemonDetails').then(module => ({
    default: module.PokemonDetails
  }))
);

export const PokemonDetailsPage = ({ pokemonId }) => {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PokemonDetailsSkeleton />}>
        <LazyPokemonDetails pokemonId={pokemonId} />
      </Suspense>
    </ErrorBoundary>
  );
};

/**
 * Data lazy loading hook
 */
export const useLazyData = (fetchFn) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const loadData = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      
      const result = await fetchFn(...args);
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);
  
  return { data, loading, error, loadData };
};

// Usage
export const PokemonCard = ({ pokemon }) => {
  const { data: details, loading, loadData } = useLazyData(
    PokemonApiService.getPokemonById
  );
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleExpand = useCallback(() => {
    if (!isExpanded && !details && !loading) {
      loadData(pokemon.id);
    }
    setIsExpanded(!isExpanded);
  }, [isExpanded, details, loading, loadData, pokemon.id]);
  
  return (
    <Card>
      <CardContent>
        <Typography variant="h6">{pokemon.name}</Typography>
        <Button onClick={handleExpand}>
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
        
        {isExpanded && (
          <Collapse in={isExpanded}>
            {loading ? (
              <CircularProgress />
            ) : details ? (
              <PokemonDetails details={details} />
            ) : null}
          </Collapse>
        )}
      </CardContent>
    </Card>
  );
};
```

### 3. Virtual Scrolling Pattern

```javascript
/**
 * Virtual scrolling for large lists
 */
import { FixedSizeList as List } from 'react-window';

export const VirtualizedPokemonList = ({ pokemonList, onItemClick }) => {
  const Row = useCallback(({ index, style }) => {
    const pokemon = pokemonList[index];
    
    return (
      <div style={style}>
        <PokemonCard
          pokemon={pokemon}
          onClick={() => onItemClick(pokemon)}
        />
      </div>
    );
  }, [pokemonList, onItemClick]);
  
  return (
    <List
      height={600}
      itemCount={pokemonList.length}
      itemSize={200}
      overscanCount={5}
    >
      {Row}
    </List>
  );
};
```

## Async Patterns

### 1. Promise-Based Pattern

```javascript
/**
 * Promise-based API service
 */
export class PokemonApiService {
  static async getPokemonList(options = {}) {
    const { offset = 0, limit = 20, signal } = options;
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/pokemon?offset=${offset}&limit=${limit}`,
        { signal }
      );
      
      if (!response.ok) {
        throw new ApiErrorDTO({
          message: `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          code: 'HTTP_ERROR'
        });
      }
      
      const data = await response.json();
      return new PokemonListResponseDTO(data);
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new ApiErrorDTO({
          message: 'Request was cancelled',
          code: 'REQUEST_CANCELLED'
        });
      }
      
      if (error instanceof ApiErrorDTO) {
        throw error;
      }
      
      throw new ApiErrorDTO({
        message: error.message || 'Network error',
        code: 'NETWORK_ERROR'
      });
    }
  }
}
```

### 2. Async Hook Pattern

```javascript
/**
 * Hook for handling async operations
 */
export const useAsync = (asyncFunction, deps = []) => {
  const [state, setState] = useState({
    data: null,
    loading: false,
    error: null
  });
  
  const execute = useCallback(async (...args) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await asyncFunction(...args);
      
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }
  }, [asyncFunction, ...deps]);
  
  return { ...state, execute };
};

// Usage
export const PokemonLoader = ({ pokemonId }) => {
  const { data, loading, error, execute } = useAsync(
    PokemonApiService.getPokemonById
  );
  
  useEffect(() => {
    if (pokemonId) {
      execute(pokemonId);
    }
  }, [pokemonId, execute]);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!data) return null;
  
  return <PokemonDetails pokemon={data} />;
};
```

### 3. Concurrent Pattern

```javascript
/**
 * Hook for handling concurrent requests
 */
export const useConcurrentRequests = () => {
  const [results, setResults] = useState(new Map());
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(new Map());
  
  const executeRequests = useCallback(async (requests) => {
    setLoading(true);
    setResults(new Map());
    setErrors(new Map());
    
    try {
      const promises = requests.map(async ({ key, request }) => {
        try {
          const result = await request();
          return { key, result, error: null };
        } catch (error) {
          return { key, result: null, error };
        }
      });
      
      const responses = await Promise.allSettled(promises);
      
      const newResults = new Map();
      const newErrors = new Map();
      
      responses.forEach((response, index) => {
        if (response.status === 'fulfilled') {
          const { key, result, error } = response.value;
          if (error) {
            newErrors.set(key, error);
          } else {
            newResults.set(key, result);
          }
        } else {
          const key = requests[index].key;
          newErrors.set(key, response.reason);
        }
      });
      
      setResults(newResults);
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  }, []);
  
  return { results, errors, loading, executeRequests };
};

// Usage
export const PokemonComparisonPage = ({ pokemonIds }) => {
  const { results, errors, loading, executeRequests } = useConcurrentRequests();
  
  useEffect(() => {
    const requests = pokemonIds.map(id => ({
      key: id,
      request: () => PokemonApiService.getPokemonById(id)
    }));
    
    executeRequests(requests);
  }, [pokemonIds, executeRequests]);
  
  if (loading) return <LoadingSpinner />;
  
  return (
    <div className="pokemon-comparison">
      {pokemonIds.map(id => {
        const pokemon = results.get(id);
        const error = errors.get(id);
        
        return (
          <div key={id} className="pokemon-comparison__item">
            {error ? (
              <ErrorDisplay error={error} />
            ) : pokemon ? (
              <PokemonCard pokemon={pokemon} />
            ) : (
              <LoadingSpinner />
            )}
          </div>
        );
      })}
    </div>
  );
};
```

## Functional Patterns

### 1. Pure Function Pattern

```javascript
/**
 * Pure functions for data transformation
 */
export const pokemonUtils = {
  /**
   * Calculate Pokemon battle power
   * @param {Object} pokemon - Pokemon data
   * @returns {number} Battle power
   */
  calculateBattlePower: (pokemon) => {
    return pokemon.stats.reduce((total, stat) => total + stat.base_stat, 0);
  },
  
  /**
   * Get Pokemon type effectiveness
   * @param {string} attackType - Attacking type
   * @param {Array<string>} defendTypes - Defending types
   * @returns {number} Effectiveness multiplier
   */
  getTypeEffectiveness: (attackType, defendTypes) => {
    const typeChart = {
      fire: { grass: 2, water: 0.5, fire: 0.5 },
      water: { fire: 2, grass: 0.5, water: 0.5 },
      grass: { water: 2, fire: 0.5, grass: 0.5 },
      // ... more type relationships
    };
    
    return defendTypes.reduce((multiplier, defendType) => {
      const effectiveness = typeChart[attackType]?.[defendType] || 1;
      return multiplier * effectiveness;
    }, 1);
  },
  
  /**
   * Format Pokemon stats for display
   * @param {Array} stats - Pokemon stats array
   * @returns {Object} Formatted stats
   */
  formatStats: (stats) => {
    return stats.reduce((formatted, stat) => {
      const statName = stat.stat.name.replace('-', ' ');
      formatted[statName] = stat.base_stat;
      return formatted;
    }, {});
  },
};
```

### 2. Composition Pattern

```javascript
/**
 * Function composition utilities
 */
export const compose = (...functions) => (value) =>
  functions.reduceRight((acc, fn) => fn(acc), value);

export const pipe = (...functions) => (value) =>
  functions.reduce((acc, fn) => fn(acc), value);

// Data transformation pipeline
const transformPokemonData = pipe(
  (apiData) => new PokemonDTO(apiData),
  (dto) => dto.toInternal(),
  (internal) => ({
    ...internal,
    battlePower: pokemonUtils.calculateBattlePower(internal),
    formattedStats: pokemonUtils.formatStats(internal.stats),
  }),
  (enhanced) => ({
    ...enhanced,
    displayName: enhanced.name.charAt(0).toUpperCase() + enhanced.name.slice(1),
  })
);

// Usage
export const usePokemonTransformation = () => {
  const [transformedPokemon, setTransformedPokemon] = useState([]);
  
  const transformAndSetPokemon = useCallback((rawPokemonData) => {
    const transformed = rawPokemonData.map(transformPokemonData);
    setTransformedPokemon(transformed);
  }, []);
  
  return { transformedPokemon, transformAndSetPokemon };
};
```

### 3. Higher-Order Function Pattern

```javascript
/**
 * Higher-order functions for reusable logic
 */
export const withRetry = (fn, maxRetries = 3, delay = 1000) => {
  return async (...args) => {
    let lastError;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = error;
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
        }
      }
    }
    
    throw lastError;
  };
};

export const withCache = (fn, cacheTime = 5 * 60 * 1000) => {
  const cache = new Map();
  
  return async (...args) => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return cached.data;
    }
    
    const result = await fn(...args);
    cache.set(key, { data: result, timestamp: Date.now() });
    
    return result;
  };
};

export const withLogging = (fn, label) => {
  return async (...args) => {
    console.log(`[${label}] Starting with args:`, args);
    const start = Date.now();
    
    try {
      const result = await fn(...args);
      console.log(`[${label}] Completed in ${Date.now() - start}ms`);
      return result;
    } catch (error) {
      console.error(`[${label}] Failed after ${Date.now() - start}ms:`, error);
      throw error;
    }
  };
};

// Composed API service
export const enhancedPokemonApi = {
  getPokemonById: withLogging(
    withCache(
      withRetry(PokemonApiService.getPokemonById)
    ),
    'getPokemonById'
  ),
  
  getPokemonList: withLogging(
    withCache(
      withRetry(PokemonApiService.getPokemonList),
      2 * 60 * 1000 // 2 minute cache
    ),
    'getPokemonList'
  ),
};
```

---

These code patterns provide a solid foundation for building maintainable, performant, and scalable React applications. Use them as guidelines and adapt them to your specific needs while maintaining consistency across the codebase.
