# 🚀 Contributing to Pokémon App

Thank you for your interest in contributing to the Pokémon App! This guide will help you get started and ensure your contributions align with our project standards.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Contributions](#making-contributions)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Requirements](#documentation-requirements)
- [Submission Guidelines](#submission-guidelines)

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher
- **npm** v9 or higher
- **Git** for version control
- **VS Code** (recommended) with suggested extensions

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json",
    "bradlc.vscode-tailwindcss",
    "formulahendry.auto-rename-tag"
  ]
}
```

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR_USERNAME/boilerplate-preact.git
cd boilerplate-preact

# Add upstream remote
git remote add upstream https://github.com/ORIGINAL_OWNER/boilerplate-preact.git
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

### 4. Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### 5. Check Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Check build
npm run build
```

## Making Contributions

### 1. Choose What to Work On

#### For New Contributors
- Look for issues labeled `good first issue`
- Start with documentation improvements
- Fix small bugs or typos
- Add tests for existing functionality

#### For Experienced Contributors
- Implement new features
- Refactor existing code
- Improve performance
- Add complex integrations

### 2. Create an Issue (if needed)

Before starting work on a significant change:

1. **Check existing issues** to avoid duplication
2. **Create a new issue** describing your proposed change
3. **Wait for feedback** from maintainers
4. **Get approval** before starting implementation

### 3. Create a Branch

```bash
# Update your fork
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b bugfix/issue-description
# or
git checkout -b docs/documentation-improvement
```

### Branch Naming Conventions

- `feature/` - New features
- `bugfix/` - Bug fixes
- `hotfix/` - Critical fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Adding tests
- `chore/` - Maintenance tasks

## Coding Standards

### 1. File Naming Conventions

```
Components:     PascalCase      → PokemonCard.jsx
Hooks:          camelCase       → usePokemon.js
Services:       camelCase       → pokemonApi.js
Constants:      SCREAMING_CASE  → API_ENDPOINTS.js
Utils:          camelCase       → formatDate.js
Tests:          camelCase       → pokemonCard.test.js
```

### 2. Code Style

#### JavaScript/JSX
```javascript
// ✅ Good: Clear, documented function
/**
 * Calculates the damage multiplier based on type effectiveness
 * @param {string} attackType - The attacking Pokemon's type
 * @param {Array<string>} defendTypes - The defending Pokemon's types
 * @returns {number} Damage multiplier (0.5, 1, or 2)
 */
export const calculateTypeEffectiveness = (attackType, defendTypes) => {
  const typeChart = getTypeChart();
  
  return defendTypes.reduce((multiplier, defendType) => {
    const effectiveness = typeChart[attackType]?.[defendType] ?? 1;
    return multiplier * effectiveness;
  }, 1);
};

// ❌ Bad: Unclear, undocumented function
export const calc = (a, d) => {
  return d.reduce((m, t) => m * (chart[a][t] || 1), 1);
};
```

#### Component Structure
```javascript
/**
 * Component for displaying Pokemon battle statistics
 * @param {Object} props
 * @param {Pokemon} props.pokemon - Pokemon data
 * @param {boolean} [props.showDetailed=false] - Show detailed stats
 * @param {Function} [props.onStatClick] - Callback when stat is clicked
 */
export const PokemonStats = ({ pokemon, showDetailed = false, onStatClick }) => {
  // 1. Hooks (state, effects, custom hooks)
  const [selectedStat, setSelectedStat] = useState(null);
  const { formatStat } = useStatFormatter();
  
  // 2. Event handlers
  const handleStatClick = useCallback((statName) => {
    setSelectedStat(statName);
    onStatClick?.(statName);
  }, [onStatClick]);
  
  // 3. Derived values
  const totalStats = useMemo(() => 
    pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  , [pokemon.stats]);
  
  // 4. Early returns
  if (!pokemon?.stats) {
    return <div>No stats available</div>;
  }
  
  // 5. Main render
  return (
    <div className="pokemon-stats">
      <Typography variant="h6">
        Stats (Total: {totalStats})
      </Typography>
      
      <List>
        {pokemon.stats.map(stat => (
          <ListItem 
            key={stat.stat.name}
            button
            onClick={() => handleStatClick(stat.stat.name)}
            selected={selectedStat === stat.stat.name}
          >
            <ListItemText
              primary={formatStat(stat.stat.name)}
              secondary={stat.base_stat}
            />
          </ListItem>
        ))}
      </List>
      
      {showDetailed && selectedStat && (
        <StatDetails 
          stat={pokemon.stats.find(s => s.stat.name === selectedStat)}
        />
      )}
    </div>
  );
};
```

### 3. Import Organization

```javascript
// 1. External libraries (alphabetical)
import React, { useState, useCallback, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Button,
  List,
  ListItem,
  ListItemText 
} from '@mui/material';

// 2. Internal utilities and services
import { PokemonApiService } from '@/services/pokemonApi.js';
import { PokemonDTO } from '@/dto/api/index.js';
import { usePokemon } from '@/hooks/usePokemon.js';
import { useStatFormatter } from '@/hooks/useStatFormatter.js';

// 3. Components (relative imports)
import { PokemonCard } from './PokemonCard.jsx';
import { StatDetails } from './StatDetails.jsx';

// 4. Styles (last)
import './PokemonStats.scss';
```

### 4. Naming Conventions

#### Variables and Functions
```javascript
// ✅ Good: Descriptive names
const pokemonBattlePower = calculateBattlePower(pokemon);
const isValidPokemonType = (type) => VALID_TYPES.includes(type);
const handlePokemonSelection = (pokemon) => { /* ... */ };

// ❌ Bad: Unclear names
const power = calc(pokemon);
const isValid = (t) => types.includes(t);
const handle = (p) => { /* ... */ };
```

#### Boolean Variables
```javascript
// ✅ Good: Clear boolean intentions
const isLoading = true;
const hasError = false;
const canEvolvePokemon = pokemon.level >= 16;
const shouldShowDetails = user.preferences.showDetails;

// ❌ Bad: Unclear boolean state
const loading = true;
const error = false;
const evolve = pokemon.level >= 16;
const details = user.preferences.showDetails;
```

#### Constants
```javascript
// ✅ Good: Clear, descriptive constants
const MAX_POKEMON_LEVEL = 100;
const POKEMON_TYPES = ['fire', 'water', 'grass', 'electric'];
const API_ENDPOINTS = {
  POKEMON_LIST: '/pokemon',
  POKEMON_DETAILS: '/pokemon/:id',
  POKEMON_SPECIES: '/pokemon-species/:id'
};

// ❌ Bad: Unclear constants
const MAX = 100;
const TYPES = ['fire', 'water', 'grass', 'electric'];
const ENDPOINTS = {
  LIST: '/pokemon',
  DETAILS: '/pokemon/:id',
  SPECIES: '/pokemon-species/:id'
};
```

## Testing Requirements

### 1. Test Coverage

All new code must have appropriate test coverage:

- **Components**: Test rendering, user interactions, and edge cases
- **Hooks**: Test state changes, side effects, and return values
- **Services**: Test API calls, error handling, and data transformation
- **Utilities**: Test pure functions with various inputs

### 2. Testing Patterns

#### Component Testing
```javascript
// src/components/PokemonCard/__tests__/PokemonCard.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PokemonCard } from '../PokemonCard.jsx';

const mockPokemon = {
  id: 25,
  name: 'pikachu',
  sprites: { front_default: 'https://example.com/pikachu.png' },
  types: [{ type: { name: 'electric' } }],
  stats: [{ stat: { name: 'hp' }, base_stat: 35 }]
};

describe('PokemonCard', () => {
  it('renders pokemon information correctly', () => {
    render(<PokemonCard pokemon={mockPokemon} />);
    
    expect(screen.getByText('Pikachu')).toBeInTheDocument();
    expect(screen.getByAltText('Pikachu')).toHaveAttribute('src', mockPokemon.sprites.front_default);
    expect(screen.getByText('Electric')).toBeInTheDocument();
  });
  
  it('calls onFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    const mockOnFavorite = vi.fn();
    
    render(<PokemonCard pokemon={mockPokemon} onFavorite={mockOnFavorite} />);
    
    const favoriteButton = screen.getByRole('button', { name: /favorite/i });
    await user.click(favoriteButton);
    
    expect(mockOnFavorite).toHaveBeenCalledWith(mockPokemon);
  });
  
  it('shows loading state when pokemon data is loading', () => {
    render(<PokemonCard pokemon={null} isLoading={true} />);
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.queryByText('Pikachu')).not.toBeInTheDocument();
  });
});
```

#### Hook Testing
```javascript
// src/hooks/__tests__/usePokemon.test.js
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePokemon } from '../usePokemon.js';

// Mock the API service
vi.mock('@/services/pokemonApi.js', () => ({
  PokemonApiService: {
    getPokemonList: vi.fn(),
    getPokemonById: vi.fn(),
  }
}));

describe('usePokemon', () => {
  it('fetches pokemon list on mount', async () => {
    const mockPokemonList = { results: [mockPokemon] };
    PokemonApiService.getPokemonList.mockResolvedValueOnce({
      toInternal: () => mockPokemonList
    });
    
    const { result } = renderHook(() => usePokemon());
    
    expect(result.current.isLoading).toBe(true);
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.pokemonList).toEqual(mockPokemonList.results);
  });
  
  it('handles API errors gracefully', async () => {
    const errorMessage = 'Failed to fetch pokemon';
    PokemonApiService.getPokemonList.mockRejectedValueOnce(new Error(errorMessage));
    
    const { result } = renderHook(() => usePokemon());
    
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });
    
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.pokemonList).toEqual([]);
  });
});
```

### 3. Test Organization

```
src/
├── components/
│   └── PokemonCard/
│       ├── PokemonCard.jsx
│       ├── __tests__/
│       │   ├── PokemonCard.test.jsx
│       │   └── PokemonCard.integration.test.jsx
│       └── index.js
├── hooks/
│   ├── usePokemon.js
│   └── __tests__/
│       └── usePokemon.test.js
└── services/
    ├── pokemonApi.js
    └── __tests__/
        └── pokemonApi.test.js
```

## Documentation Requirements

### 1. JSDoc Comments

All public functions, components, and classes must have JSDoc documentation:

```javascript
/**
 * Custom hook for managing Pokemon data and related operations
 * 
 * @example
 * ```javascript
 * const { pokemonList, isLoading, fetchPokemon } = usePokemon();
 * 
 * useEffect(() => {
 *   fetchPokemon();
 * }, [fetchPokemon]);
 * ```
 * 
 * @returns {Object} Pokemon state and operations
 * @returns {Array<Pokemon>} returns.pokemonList - List of Pokemon
 * @returns {boolean} returns.isLoading - Loading state
 * @returns {string|null} returns.error - Error message if any
 * @returns {Function} returns.fetchPokemon - Function to fetch Pokemon
 * @returns {Function} returns.searchPokemon - Function to search Pokemon
 */
export const usePokemon = () => {
  // Implementation
};
```

### 2. README Files

Each feature directory should have a README.md:

```markdown
# Pokemon Feature

This feature handles all Pokemon-related functionality in the application.

## Components

- `PokemonCard` - Displays individual Pokemon information
- `PokemonList` - Renders a list of Pokemon cards
- `PokemonFilters` - Provides filtering options

## Hooks

- `usePokemon` - Manages Pokemon data and operations
- `usePokemonSearch` - Handles Pokemon search functionality

## Usage

```javascript
import { PokemonCard, usePokemon } from '@/features/pokemon';

const MyComponent = () => {
  const { pokemonList, isLoading } = usePokemon();
  
  return (
    <div>
      {pokemonList.map(pokemon => (
        <PokemonCard key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};
```
```

### 3. Code Comments

Add comments for complex logic, business rules, and non-obvious code:

```javascript
// Calculate type effectiveness using the official Pokemon type chart
// Fire is super effective (2x) against Grass
// Water is not very effective (0.5x) against Fire
// Normal effectiveness is 1x
const calculateDamage = (attackType, defendType, baseDamage) => {
  const typeChart = {
    fire: { grass: 2, water: 0.5, rock: 0.5 },
    water: { fire: 2, ground: 2, rock: 2 },
    // ... more type relationships
  };
  
  const effectiveness = typeChart[attackType]?.[defendType] ?? 1;
  
  // Apply STAB (Same Type Attack Bonus) - 1.5x damage when attacker 
  // uses move of their own type
  const stabMultiplier = attackType === defendType ? 1.5 : 1;
  
  return Math.floor(baseDamage * effectiveness * stabMultiplier);
};
```

## Submission Guidelines

### 1. Commit Messages

Use the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
type(scope): subject

body

footer
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, semicolons, etc.)
- `refactor` - Code refactoring without behavior changes
- `test` - Adding or updating tests
- `chore` - Maintenance tasks, build changes, etc.

**Examples:**
```
feat(pokemon): add search functionality

Implement search input component with debounced API calls.
Users can now search for Pokemon by name or type.

Closes #123
```

```
fix(auth): resolve login redirect issue

The login component wasn't redirecting properly after
successful authentication due to missing dependency
in useEffect hook.

Fixes #456
```

### 2. Pull Request Process

#### Before Creating a PR

1. **Sync with upstream**:
   ```bash
   git checkout main
   git pull upstream main
   git checkout your-feature-branch
   git rebase main
   ```

2. **Run quality checks**:
   ```bash
   npm run lint
   npm test
   npm run build
   ```

3. **Update documentation** if needed

4. **Squash commits** if you have multiple small commits

#### Creating the PR

1. **Use the PR template**
2. **Write a clear title** and description
3. **Link related issues** with "Closes #issue-number"
4. **Add screenshots** for UI changes
5. **Request review** from relevant team members

#### PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## How Has This Been Tested?
- [ ] Unit tests
- [ ] Integration tests
- [ ] Manual testing

## Screenshots (if applicable)
Add screenshots here

## Checklist
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
```

### 3. Code Review Process

#### As an Author
- **Respond to feedback** promptly and respectfully
- **Ask for clarification** if review comments are unclear
- **Make requested changes** or explain why you disagree
- **Re-request review** after making changes
- **Keep PRs small** and focused on a single change

#### As a Reviewer
- **Be constructive** and helpful in your feedback
- **Focus on the code**, not the person
- **Suggest improvements** rather than just pointing out problems
- **Approve when ready** - don't hold up good changes
- **Test the changes** if possible

## Getting Help

### Common Issues

#### Setup Problems
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node.js version
node --version  # Should be v18+
```

#### Test Failures
```bash
# Run tests in verbose mode
npm test -- --verbose

# Run specific test file
npm test -- PokemonCard.test.jsx

# Update test snapshots (if applicable)
npm test -- --updateSnapshot
```

#### Build Issues
```bash
# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint

# Clear build cache
rm -rf dist .vite
npm run build
```

### Where to Get Help

1. **Documentation**: Check our comprehensive docs first
2. **GitHub Issues**: Search existing issues for similar problems
3. **GitHub Discussions**: Ask questions in our discussion forum
4. **Code Reviews**: Ask specific questions in your PR
5. **Maintainers**: Reach out directly for urgent issues

### Useful Resources

- [React Documentation](https://react.dev/)
- [Preact Documentation](https://preactjs.com/)
- [Material-UI Documentation](https://mui.com/)
- [Testing Library Documentation](https://testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)

---

Thank you for contributing to the Pokémon App! Your contributions help make this project better for everyone. If you have any questions or need help, don't hesitate to reach out to the community or maintainers.

Happy coding! 🚀
