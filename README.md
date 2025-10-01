# Pokémon App - Preact

A modern Pokédex application built with Preact, Material-UI, Redux Toolkit, and Feature-Based Architecture.

## 🚀 Features

### 🔐 Core Features

- **Authentication**: Sistema de login com credenciais de teste
- **Pokémon Listing**: Pokédex completa com paginação e busca
- **Advanced Filters**: Filtros por nome, tipo e ordenação
- **Favorites**: Sistema completo para marcar e gerenciar Pokémon favoritos
- **Comparison**: Comparação avançada entre até 4 Pokémon simultaneamente
- **GraphQL Integration**: Suporte tanto para REST quanto GraphQL APIs
- **Pokémon Details**: Página detalhada com estatísticas, habilidades e tipos
- **Search & Sort**: Busca e ordenação em favoritos e lista principal

### 🎨 UI/UX

- **Theming**: Suporte a tema claro e escuro
- **Responsive Layout**: Interface adaptativa para diferentes dispositivos
- **Material Design**: Componentes MUI com design consistente
- **SCSS Modular**: Sistema de estilos organizado e reutilizável

### 🌍 Internacionalização

- **Multi-language**: Suporte a português e inglês
- **Language Detection**: Detecção automática do idioma do usuário
- **Dynamic Translation**: Troca de idioma em tempo real

### 📱 PWA Features

- **Offline Support**: Funcionalidades básicas disponíveis offline
- **Installable**: Aplicação instalável como PWA
- **Service Workers**: Cache inteligente para melhor performance
- **Push Notifications**: Notificações de atualização

### 🧪 Quality & Testing

- **Unit Testing**: Cobertura de testes com Vitest
- **Integration Testing**: Testes de fluxos completos
- **E2E Testing**: Testes end-to-end automatizados
- **Code Quality**: ESLint para consistência de código

## 🛠️ Technologies

### Core Stack

- **Preact**: Lightweight and fast JavaScript framework
- **Material-UI (MUI)**: UI component library with theming
- **SCSS/Sass**: CSS preprocessor with variables and mixins
- **Redux Toolkit**: State management with feature-based organization
- **Vite**: Build tool and development server
- **JavaScript**: Main language with JSDoc for typing

### Architecture & Patterns

- **Feature-Based Architecture**: Código organizado por funcionalidades de negócio
- **DTOs**: Data Transfer Objects for API and Redux contracts
- **Container/Presentation Pattern**: Separação entre lógica e UI
- **Custom Hooks**: Encapsulamento de lógica de negócio

### PWA & i18n

- **PWA**: Progressive Web App com Service Workers
- **i18next**: Sistema completo de internacionalização
- **Service Workers**: Cache inteligente e funcionalidades offline

### Testing & Quality

- **Vitest**: Testing framework moderno
- **Testing Library**: Component testing utilities
- **ESLint**: Code linting e quality assurance

### External APIs

- **PokéAPI**: Official Pokémon REST API
- **PokéAPI GraphQL**: GraphQL endpoint para consultas avançadas

## 📁 Project Structure

```
src/
├── components/               # Componentes globais reutilizáveis
│   ├── layout/              # Header, Sidebar, MainLayout
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainLayout.jsx
│   │   └── index.js
│   ├── ProtectedRoute.jsx
│   ├── LanguageSelector.jsx
│   └── PWAInstallPrompt.jsx
├── features/                 # 🏗️ ARQUITETURA BASEADA EM FEATURES
│   ├── auth/                # 🔐 Feature de Autenticação
│   │   ├── components/      # Componentes da feature
│   │   │   ├── containers/
│   │   │   ├── presentations/
│   │   │   └── __tests__/
│   │   ├── dto/             # DTOs específicos da feature
│   │   │   ├── api/
│   │   │   ├── redux/
│   │   │   └── validation/
│   │   ├── hooks/           # useAuth
│   │   ├── store/           # authSlice
│   │   ├── styles/          # SCSS específicos
│   │   └── index.js         # Barrel exports
│   ├── pokemon/             # 🎮 Feature Principal dos Pokémon
│   │   ├── components/      # PokemonCard, PokemonList, etc.
│   │   ├── dto/             # DTOs da feature
│   │   ├── hooks/           # usePokemon, useFavorites, useComparison
│   │   ├── pages/           # HomePage, PokemonListPage, etc.
│   │   ├── services/        # pokemonApi.js, pokemonGraphQLApi.js
│   │   ├── store/           # pokemonSlice, favoritesSlice, comparisonSlice
│   │   └── styles/          # SCSS específicos
│   ├── i18n/                # 🌍 Internacionalização
│   │   ├── hooks/           # useTranslation
│   │   ├── locales/         # pt-BR.json, en-US.json
│   │   └── index.js         # Configuração i18next
│   └── shared/              # 🔧 Recursos Compartilhados
│       ├── components/      # Componentes reutilizáveis
│       ├── dto/             # DTOs globais
│       ├── hooks/           # useAppDispatch, useAppSelector
│       ├── store/           # uiSlice
│       ├── styles/          # variables.scss, mixins.scss, base.scss
│       └── utils/           # serviceWorker.js, etc.
├── store/                   # ⚙️ Configuração Redux principal
│   └── index.js
├── test/                    # Configuração de testes
│   └── setup.js
├── theme/                   # Configuração tema MUI
│   └── theme.js
├── __tests__/              # Testes de integração e E2E
│   ├── integration/
│   └── e2e/
└── index.js                # 🎯 Barrel exports principal
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

#### Development

- `npm run dev` - Start development server (Vite)
- `npm run build` - Generate production build
- `npm run preview` - Preview production build

#### Testing

- `npm run test` - Run tests in watch mode
- `npm run test:ui` - Run tests with Vitest UI
- `npm run test:unit` - Run unit tests only
- `npm run test:integration` - Run integration tests
- `npm run test:e2e` - Run end-to-end tests
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:watch` - Run tests in watch mode

#### Code Quality

- `npm run lint` - Check linting issues
- `npm run lint:fix` - Fix linting issues automatically

#### Documentation

- `npm run docs:serve` - Serve documentation with Docsify

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

### Pokémon Details

- Complete Pokémon information display
- Stats visualization with progress bars
- Type effectiveness and weaknesses
- Abilities and moves information
- Favorite and comparison actions
- Social sharing capabilities

### Favorites System

- Add/remove Pokémon from favorites
- Dedicated favorites page with search and sort
- Persistent storage in localStorage
- Bulk operations (clear all favorites)
- Visual indicators throughout the app

### Comparison System

- Compare up to 4 Pokémon simultaneously
- Side-by-side stats comparison
- Visual charts and progress indicators
- Highlight best stats automatically
- Remove individual Pokémon or clear all

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

O estado da aplicação é gerenciado por **Redux Toolkit** com arquitetura baseada em features:

### Redux Slices

- **authSlice**: Autenticação do usuário (login, logout, user state)
- **pokemonSlice**: Dados principais dos Pokémon (lista, filtros, paginação, detalhes)
- **favoritesSlice**: Sistema completo de favoritos (adicionar, remover, busca, ordenação)
- **comparisonSlice**: Comparação entre Pokémon (até 4 simultâneos, estatísticas)
- **uiSlice**: Estado da interface (sidebar, tema, loading global)

### Custom Hooks

- **useAuth**: Encapsula lógica de autenticação
- **usePokemon**: Gerencia estado e operações dos Pokémon (lista, filtros, detalhes)
- **useFavorites**: Operações completas de favoritos (CRUD, busca, ordenação)
- **useComparison**: Lógica avançada de comparação (até 4 Pokémon, estatísticas)
- **useTranslation**: Internacionalização

### Organização

Cada feature possui seus próprios hooks e slices, mantendo a separação de responsabilidades e facilitando a manutenção.

## 🌐 API

The application uses [PokéAPI](https://pokeapi.co/) to get Pokémon data. The API is free and requires no authentication.

### REST API

- **Base URL**: `https://pokeapi.co/api/v2`
- **Endpoints**: Pokémon list, individual Pokémon details, types, abilities
- **Features**: Pagination, filtering, detailed Pokémon information

### GraphQL API

- **Endpoint**: `https://graphql.pokeapi.co/v1beta2/`
- **Features**: Advanced queries, optimized data fetching, complex filtering
- **Benefits**: Reduced over-fetching, flexible queries, better performance

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
  lg: 1200px,
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

## 📚 Documentação

Para documentação completa do projeto, confira a pasta `docs/` que contém:

### 🏠 [Índice da Documentação](./docs/index.md)

- Guia de navegação completo
- Links organizados por função
- Busca rápida de tópicos

### 🏗️ [Arquitetura Geral](./docs/arquitetura-geral.md)

- Visão geral da arquitetura Feature-Based
- Stack tecnológica e princípios implementados

### 🎨 [Padrões de Componentes](./docs/padroes-componentes.md)

- Container/Presentation Pattern
- Boas práticas para criação de componentes

### 🔄 [Gerenciamento de Estado](./docs/gerenciamento-estado.md)

- Redux Toolkit com custom hooks
- Organização por features

### 📦 [Padrões de DTOs](./docs/padroes-dto.md)

- Data Transfer Objects organizados por features
- Factory Pattern e transformações

### 🔧 [Camada de Serviços](./docs/camada-servicos.md)

- Services organizados por features
- Comunicação com APIs

### 🌐 [APIs e Serviços](./docs/apis-e-servicos.md)

- Integração REST e GraphQL
- DTOs e transformações
- PokéAPI endpoints

### 🧪 [Estratégias de Teste](./docs/estrategias-teste.md)

- Configuração e padrões para testes
- Testes unitários e de integração

### 🚀 [Funcionalidades Avançadas](./docs/funcionalidades-avancadas.md)

- Sistema de favoritos completo
- Comparação entre Pokémon
- Integração GraphQL
- PWA e Service Workers

### 🔧 Configuração e Ferramentas

- **[Configuração Vite](./docs/configuracao-vite.md)** - Setup do Vite, aliases e otimizações
- **[Internacionalização](./docs/internacionalizacao.md)** - Sistema i18n completo
- **[PWA e Service Workers](./docs/pwa-service-workers.md)** - Progressive Web App

### 🚀 Deploy e Produção

- **[Deploy e Configurações](./docs/deployment.md)** - Deploy para múltiplas plataformas

## 📱 PWA Features

Esta aplicação é uma **Progressive Web App** completa com:

### ✨ Funcionalidades PWA

- **📲 Instalável**: Pode ser instalada como app nativo
- **⚡ Offline**: Funcionalidades básicas disponíveis sem internet
- **🔄 Service Worker**: Cache inteligente para melhor performance
- **🔔 Notificações**: Avisos de atualização da aplicação
- **📊 Manifest**: Configuração completa PWA

### 🌍 Internacionalização

- **🇧🇷 Português** e **🇺🇸 English** suportados
- **🔍 Detecção automática** do idioma do usuário
- **🔄 Troca dinâmica** de idioma em tempo real
- **💾 Persistência** da preferência do usuário

### 🎨 Theming

- **🌞 Tema claro** e **🌙 tema escuro**
- **🎨 Material Design** consistente
- **📱 Responsivo** em todos os dispositivos

## 📄 License

This project is open source and available under the MIT license.
