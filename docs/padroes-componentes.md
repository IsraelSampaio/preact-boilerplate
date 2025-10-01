# 🎨 Padrões de Componentes

## 📋 Visão Geral

Este documento descreve os padrões de componentes utilizados na aplicação Pokémon, incluindo estrutura, organização e boas práticas implementadas.

## 🏗️ Arquitetura de Componentes

### 1. **Estrutura de Pastas**

```
src/
├── components/           # Componentes reutilizáveis globais
│   ├── layout/          # Componentes de layout
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   ├── MainLayout.jsx
│   │   └── index.js     # Barrel exports
│   └── ProtectedRoute.jsx
└── features/            # Componentes específicos por feature
    ├── auth/
    │   └── components/
    │       └── LoginForm.jsx
    └── pokemon/
        ├── components/
        │   ├── PokemonCard.jsx
        │   ├── PokemonFilters.jsx
        │   └── PokemonList.jsx
        └── pages/
            ├── HomePage.jsx
            └── PokemonListPage.jsx
```

### 2. **Categorias de Componentes**

#### **Layout Components** (`src/components/layout/`)

- **Propósito**: Estrutura e organização da interface
- **Responsabilidade**: Layout, navegação, estrutura de páginas
- **Reutilização**: Alta - usados em toda aplicação

#### **Feature Components** (`src/features/*/components/`)

- **Propósito**: Funcionalidades específicas de cada feature
- **Responsabilidade**: Lógica de negócio específica
- **Reutilização**: Média - dentro da feature

#### **Page Components** (`src/features/*/pages/`)

- **Propósito**: Páginas completas da aplicação
- **Responsabilidade**: Orquestração de components e layout
- **Reutilização**: Baixa - específicas por rota

## 🎯 Padrões de Implementação

### 1. **Estrutura Padrão de Componente**

```jsx
import { useState } from "preact/hooks";
import { Box, Typography } from "@mui/material";
import { useCustomHook } from "@/hooks/useCustomHook.js";

/**
 * Component Description
 * @param {Object} props - Component props
 * @param {string} props.title - Title to display
 * @param {Function} props.onAction - Callback function
 */
export const ComponentName = ({ title, onAction, children }) => {
  // 1. Hooks (estado local)
  const [localState, setLocalState] = useState("");

  // 2. Custom hooks (lógica de negócio)
  const { data, loading, error } = useCustomHook();

  // 3. Event handlers
  const handleClick = (event) => {
    onAction?.(event);
  };

  // 4. Render condicional (se necessário)
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // 5. JSX principal
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6">{title}</Typography>
      {children}
    </Box>
  );
};
```

### 2. **Props Pattern**

```jsx
// ✅ Bom: Props tipadas e com defaults
export const PokemonCard = ({
  pokemon,
  onFavorite = () => {},
  isFavorite = false,
  size = "medium",
}) => {
  // Implementation
};

// ✅ Bom: Props de configuração agrupadas
export const PokemonList = ({
  pokemonList = [],
  config = { showFilters: true, enablePagination: true },
  callbacks = { onFavorite: null, onSelect: null },
}) => {
  // Implementation
};
```

### 3. **Composition Pattern**

```jsx
// ✅ Padrão: Composition com children
export const Card = ({ children, ...props }) => (
  <MuiCard {...props}>{children}</MuiCard>
);

// ✅ Padrão: Compound Components
Card.Header = ({ children }) => (
  <CardContent sx={{ pb: 0 }}>{children}</CardContent>
);

Card.Body = ({ children }) => <CardContent>{children}</CardContent>;

Card.Actions = ({ children }) => <CardActions>{children}</CardActions>;

// Uso:
<Card>
  <Card.Header>
    <Typography variant="h6">Título</Typography>
  </Card.Header>
  <Card.Body>
    <Typography>Conteúdo</Typography>
  </Card.Body>
  <Card.Actions>
    <Button>Ação</Button>
  </Card.Actions>
</Card>;
```

## 🎨 Integração com Material-UI

### 1. **Uso do Sistema de Tema**

```jsx
import { useTheme } from "@mui/material/styles";

export const ThemedComponent = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2),
        borderRadius: theme.shape.borderRadius,
      }}
    >
      Content
    </Box>
  );
};
```

### 2. **Responsive Design**

```jsx
export const ResponsiveComponent = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: { xs: "column", md: "row" },
      gap: { xs: 1, md: 2 },
      padding: { xs: 1, sm: 2, md: 3 },
    }}
  >
    <Box sx={{ flex: { md: 1 } }}>Content 1</Box>
    <Box sx={{ flex: { md: 2 } }}>Content 2</Box>
  </Box>
);
```

### 3. **Custom Styling**

```jsx
// ✅ Padrão: Usar sx prop para estilos customizados
export const CustomButton = ({ variant = "contained", ...props }) => (
  <Button
    variant={variant}
    sx={{
      textTransform: "none",
      borderRadius: 2,
      "&:hover": {
        transform: "scale(1.05)",
      },
    }}
    {...props}
  />
);
```

## 🔧 Padrões de Hooks

### 1. **Hook de Estado Local**

```jsx
export const ComponentWithState = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleInputChange = (field) => (event) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  return (
    <form>
      <input value={formData.email} onChange={handleInputChange("email")} />
      <input
        value={formData.password}
        onChange={handleInputChange("password")}
      />
    </form>
  );
};
```

### 2. **Hook Customizado**

```jsx
// hooks/useFormValidation.js
export const useFormValidation = (initialValues, validationRules) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    Object.keys(validationRules).forEach((field) => {
      const rule = validationRules[field];
      if (rule.required && !values[field]) {
        newErrors[field] = "Campo obrigatório";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return { values, setValues, errors, validate };
};

// Uso no componente
export const FormComponent = () => {
  const { values, setValues, errors, validate } = useFormValidation(
    { email: "", password: "" },
    {
      email: { required: true },
      password: { required: true },
    },
  );

  // Rest of component
};
```

## 🎯 Padrões de Props e Events

### 1. **Event Handling Pattern**

```jsx
export const InteractiveComponent = ({ onAction, item }) => {
  // ✅ Padrão: Closure para passar dados
  const handleClick = () => {
    onAction?.(item.id, item);
  };

  // ✅ Padrão: Event object quando necessário
  const handleInputChange = (event) => {
    onAction?.(event.target.value, event);
  };

  return (
    <div>
      <button onClick={handleClick}>Action</button>
      <input onChange={handleInputChange} />
    </div>
  );
};
```

### 2. **Conditional Rendering Pattern**

```jsx
export const ConditionalComponent = ({
  isLoading,
  error,
  data,
  emptyMessage = "Nenhum dado encontrado",
}) => {
  // ✅ Padrão: Early returns para casos especiais
  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!data?.length) {
    return <Typography color="text.secondary">{emptyMessage}</Typography>;
  }

  // Render principal
  return (
    <div>
      {data.map((item) => (
        <ItemComponent key={item.id} item={item} />
      ))}
    </div>
  );
};
```

## 📋 Lista de Componentes Implementados

### Layout Components

- **`MainLayout`**: Layout principal com header e sidebar
- **`Header`**: Barra superior com navegação e ações
- **`Sidebar`**: Menu lateral com navegação

### Pokemon Feature

- **`PokemonCard`**: Card individual do Pokémon
- **`PokemonList`**: Lista de Pokémon com paginação
- **`PokemonFilters`**: Filtros de busca e ordenação
- **`HomePage`**: Página inicial com overview
- **`PokemonListPage`**: Página principal da Pokédex

### Auth Feature

- **`LoginForm`**: Formulário de login
- **`ProtectedRoute`**: HOC para proteção de rotas

## ✅ Boas Práticas

### 1. **Nomeação**

- Use PascalCase para componentes
- Use camelCase para props e funções
- Use nomes descritivos e específicos

### 2. **Performance**

- Use `memo` quando apropriado
- Evite criar objetos/funções inline no render
- Use `useCallback` para funções passadas como props

### 3. **Acessibilidade**

- Sempre inclua `alt` em imagens
- Use `aria-label` quando necessário
- Mantenha ordem lógica de foco

### 4. **Testabilidade**

- Use `data-testid` para elementos testáveis
- Mantenha lógica fora do JSX
- Props bem definidas facilitam mocking

## 🚫 Anti-Padrões Evitados

### ❌ Não fazer:

```jsx
// Lógica complexa no JSX
return (
  <div>
    {items
      .filter((item) => item.active)
      .map((item) => item.name.toUpperCase())
      .sort()
      .map((name) => (
        <div key={name}>{name}</div>
      ))}
  </div>
);

// Props drilling excessivo
<ComponentA prop1={data.prop1} prop2={data.prop2} prop3={data.prop3} />;

// Estado desnecessário no Redux
const [localCount, setLocalCount] = useState(0); // Deveria ser local mesmo
```

### ✅ Fazer:

```jsx
// Lógica extraída
const processedItems = useMemo(
  () =>
    items
      .filter((item) => item.active)
      .map((item) => item.name.toUpperCase())
      .sort(),
  [items],
);

return (
  <div>
    {processedItems.map((name) => (
      <div key={name}>{name}</div>
    ))}
  </div>
);

// Props agrupadas
<ComponentA data={data} />;

// Estado local apropriado
const [localCount, setLocalCount] = useState(0);
```
