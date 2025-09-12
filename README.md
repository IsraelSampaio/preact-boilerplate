# Pokémon App - Preact

A modern Pokédex application built with Preact, Material-UI, Redux Toolkit, and Feature-Based Architecture.

## 🚀 Features

- **Authentication**: Login system with test credentials
- **Pokémon Listing**: Complete Pokédex view with pagination
- **Advanced Filters**: Search by name, type, and sorting
- **Favorites**: System to mark favorite Pokémon
- **Theming**: Light and dark theme support
- **Responsive Layout**: Adaptive interface for different devices
- **Testing**: Unit test coverage with Vitest and Testing Library

## 🛠️ Technologies

- **Preact**: Lightweight and fast JavaScript framework
- **Material-UI (MUI)**: UI component library
- **SCSS/Sass**: CSS preprocessor with variables and mixins
- **Redux Toolkit**: State management
- **JavaScript**: Main language with JSDoc for typing
- **DTOs**: Data Transfer Objects for API and Redux contracts
- **Vitest**: Testing framework
- **Testing Library**: Component testing utilities
- **PokéAPI**: Official Pokémon API

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── layout/         # Header, Sidebar, MainLayout
│   └── ProtectedRoute.js
├── dto/               # Data Transfer Objects
│   ├── api/          # DTOs for external API
│   ├── redux/        # DTOs for Redux state
│   ├── validation/   # DTOs for validation
│   └── index.js      # Factory and utilities
├── features/           # Feature Based Architecture
│   ├── auth/          # Authentication feature
│   └── pokemon/       # Pokémon feature
├── hooks/             # Custom hooks
├── services/          # Services and APIs
├── store/             # Redux store and slices
├── styles/            # Organized SCSS styles
│   ├── variables.scss # Color, spacing variables, etc.
│   ├── mixins.scss    # Reusable mixins
│   ├── base.scss      # Base styles and reset
│   ├── components.scss# Component styles
│   └── index.scss     # Main import file
├── theme/             # MUI theme configuration
├── types/             # JSDoc type definitions
└── utils/             # Utilities
```

## 🚦 How to Run

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd boilerplate-preact
```

2. Install dependencies:
```bash
npm install
```

3. Run the project in development mode:
```bash
npm run dev
```

4. Access `http://localhost:5173` in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Generate production build
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run lint` - Check linting issues
- `npm run lint:fix` - Fix linting issues automatically

## 🔐 Test Credentials

To access the application, use the following credentials:

- **Email**: admin@pokemon.com
- **Password**: admin123

## 🎨 SCSS Styling System

The project uses **SCSS** for styling with a modular and organized architecture:

### SCSS Structure
- **`variables.scss`**: Color, spacing, breakpoint, and z-index variables
- **`mixins.scss`**: Reusable mixins for responsiveness, flexbox, animations
- **`base.scss`**: CSS reset, base styles, and global utilities
- **`components.scss`**: Component-specific styles (.pokemon-card, .btn, etc.)
- **`index.scss`**: Main file that imports all others

### SCSS Features
- **Variables**: Pokémon type colors, responsive breakpoints, spacing
- **Mixins**: @include flex-center, @include respond-to, @include card-hover
- **Nesting**: Clear and readable hierarchical structure
- **Functions**: Dynamic calculations and color manipulation
- **Extends**: Style inheritance with @extend

### Utility Classes
- `.flex-center`, `.flex-between` - Flexbox layout
- `.gap-1` to `.gap-5` - Consistent spacing
- `.btn`, `.btn--primary`, `.btn--outline` - Styled buttons
- `.pokemon-card`, `.pokemon-list__grid` - Specific components
- `.alert`, `.alert--error` - Alert system

## 🎨 Interface Features

### Login Page
- Authentication form with validation
- Password visibility toggle
- Visible test credentials
- Error feedback
- Custom SCSS styles

### Main Page
- Dashboard with user information
- Cards with main functionalities
- Navigation to other sections

### Pokémon List
- Responsive grid of Pokémon cards
- Filters by name and type
- Sorting by different criteria
- Pagination
- Favorites system
- Loading states and error handling

### Layout
- Header with user menu and theme toggle
- Sidebar with main navigation
- Responsive layout

### DTOs (Data Transfer Objects)
- **API Contracts**: DTOs for PokéAPI communication
- **Redux State**: DTOs for state management
- **Validation**: DTOs for input data validation
- **Factory Pattern**: Standardized object creation
- **Transformation**: Conversion between API and internal state formats

## 🧪 Testing

The project includes unit tests for:

- Authentication components
- API services
- Custom hooks
- Redux slices
- DTOs and validations

Run tests with:
```bash
npm run test
```

## 📱 Responsiveness

The application is fully responsive and works well on:

- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (up to 767px)

## 🔄 State Management

The application state is managed by Redux Toolkit with the following slices:

- **authSlice**: User authentication
- **pokemonSlice**: Pokémon data and filters
- **uiSlice**: Interface state (sidebar, theme, loading)

## 🌐 API

The application uses [PokéAPI](https://pokeapi.co/) to get Pokémon data. The API is free and requires no authentication.

## 🎨 How to Use the SCSS System

### Available Variables
```scss
// Colors
$primary-color: #3b82f6;
$secondary-color: #ef4444;
$background-light: #f8fafc;

// Spacing
$spacing-sm: 0.5rem;
$spacing-md: 1rem;
$spacing-lg: 1.5rem;

// Breakpoints
$breakpoints: (
  sm: 600px,
  md: 900px,
  lg: 1200px
);
```

### Useful Mixins
```scss
// Responsiveness
@include respond-to(md) {
  // Styles for medium screens and larger
}

// Flexbox layout
@include flex-center; // Centers content
@include flex-between; // Space between elements

// Hover effects
@include card-hover; // Elevation effect on hover
```

### Utility Classes
```html
<!-- Layout -->
<div class="flex-center">Centered content</div>
<div class="flex-between">Spaced elements</div>

<!-- Spacing -->
<div class="gap-2">Gap of 0.5rem</div>
<div class="p-3">Padding of 1rem</div>

<!-- Components -->
<button class="btn btn--primary">Primary button</button>
<button class="btn btn--outline">Outline button</button>

<!-- Alerts -->
<div class="alert alert--error">Error</div>
<div class="alert alert--success">Success</div>
```

## 📚 Documentation

For complete project documentation, check the `docs/` folder which contains:

### 🏠 [Documentation Index](./docs/index.md)
- Complete navigation guide
- Links organized by role
- Quick topic search


### 🎨 [Code Patterns](./docs/patterns/)
- **[Patterns Overview](./docs/patterns/README.md)** - All patterns with quick examples
- **[Architectural Patterns](./docs/patterns/architectural-patterns.md)** - Feature-based, Layered, DI patterns
- **[Code Patterns](./docs/patterns/code-patterns.md)** - Component, Hook, Error handling patterns

### 🤝 [Collaboration](./docs/collaboration/)
- **[Collaboration Guide](./docs/collaboration/README.md)** - How to collaborate effectively
- **[Contributing Guidelines](./docs/collaboration/CONTRIBUTING.md)** - Complete contribution guide

### 📋 [DTOs](./docs/DTOs.md)
- Data Transfer Objects
- API and Redux contracts
- Factory Pattern

## 📄 License

This project is open source and available under the MIT license.
