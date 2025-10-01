# ⚡ Configuração Vite

## 📋 Visão Geral

O projeto utiliza **Vite** como build tool e servidor de desenvolvimento, proporcionando desenvolvimento rápido com Hot Module Replacement (HMR), build otimizado e configuração simplificada para Preact.

## ⚙️ Configuração Principal

### 1. **vite.config.js**

```javascript
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { resolve } from "path";

export default defineConfig({
  plugins: [preact()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "@/components": resolve(__dirname, "./src/components"),
      "@/features": resolve(__dirname, "./src/features"),
      "@/hooks": resolve(__dirname, "./src/hooks"),
      "@/services": resolve(__dirname, "./src/services"),
      "@/store": resolve(__dirname, "./src/store"),
      "@/types": resolve(__dirname, "./src/types"),
      "@/utils": resolve(__dirname, "./src/utils"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
});
```

## 🔧 Funcionalidades Configuradas

### 1. **Preset Preact**

```javascript
// @preact/preset-vite configurado automaticamente:
// - Suporte completo ao Preact
// - Hot Module Replacement (HMR)
// - JSX transforms otimizados
// - Alias automático preact/compat para compatibilidade React
plugins: [preact()];
```

### 2. **Path Aliases**

O sistema de aliases permite imports limpos e organizados:

```javascript
// Ao invés de:
import { Component } from "../../../components/Component.jsx";
import { useAuth } from "../../../features/auth/hooks/useAuth.js";

// Use:
import { Component } from "@/components/Component.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth.js";
```

#### **Aliases Configurados:**

- `@/` → `./src/`
- `@/components` → `./src/components`
- `@/features` → `./src/features`
- `@/hooks` → `./src/hooks`
- `@/services` → `./src/services`
- `@/store` → `./src/store`
- `@/types` → `./src/types`
- `@/utils` → `./src/utils`

### 3. **Configuração de Testes**

```javascript
test: {
  environment: 'jsdom',           // Ambiente DOM para testes
  setupFiles: ['./src/test/setup.js'], // Setup global dos testes
}
```

### 4. **Otimização de Dependências**

```javascript
optimizeDeps: {
  include: [
    "@mui/material",
    "@mui/icons-material",
    "@emotion/react",
    "@emotion/styled",
  ];
}
```

Força a pré-compilação dessas dependências para melhor performance de desenvolvimento.

## 📦 Scripts do Package.json

### 1. **Scripts de Desenvolvimento**

```json
{
  "scripts": {
    "dev": "vite", // Servidor de desenvolvimento
    "build": "vite build", // Build de produção
    "preview": "vite preview" // Preview do build
  }
}
```

### 2. **Scripts de Teste**

```json
{
  "scripts": {
    "test": "vitest", // Testes em watch mode
    "test:ui": "vitest --ui", // Interface gráfica dos testes
    "test:unit": "vitest run --reporter=verbose src/**/*.test.{js,jsx}",
    "test:integration": "vitest run --reporter=verbose src/__tests__/integration/**/*.test.{js,jsx}",
    "test:e2e": "vitest run --reporter=verbose src/__tests__/e2e/**/*.test.{js,jsx}",
    "test:coverage": "vitest run --coverage", // Testes com coverage
    "test:watch": "vitest --watch" // Testes em watch mode
  }
}
```

### 3. **Scripts de Qualidade**

```json
{
  "scripts": {
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint . --ext js,jsx --fix"
  }
}
```

### 4. **Scripts de Documentação**

```json
{
  "scripts": {
    "docs:serve": "docsify serve docs -p 3000"
  }
}
```

## 🚀 Performance e Otimizações

### 1. **Configurações de Build**

```javascript
// Configurações avançadas de build (opcional)
export default defineConfig({
  build: {
    target: "esnext", // Target moderno
    minify: "esbuild", // Minificação rápida
    sourcemap: true, // Source maps para debug
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["preact", "preact-router"],
          mui: ["@mui/material", "@mui/icons-material"],
          utils: ["@reduxjs/toolkit", "react-redux"],
        },
      },
    },
  },
});
```

### 2. **Configurações de Servidor**

```javascript
export default defineConfig({
  server: {
    port: 5173, // Porta padrão
    open: true, // Abrir navegador automaticamente
    cors: true, // CORS habilitado
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

### 3. **Configurações de Preview**

```javascript
export default defineConfig({
  preview: {
    port: 4173,
    open: true,
    cors: true,
  },
});
```

## 🔄 Hot Module Replacement (HMR)

### 1. **HMR Automático**

Vite + Preact oferece HMR out-of-the-box para:

- Componentes Preact/JSX
- CSS/SCSS
- Módulos ES6
- Assets estáticos

### 2. **HMR Customizado**

```javascript
// src/main.jsx
if (import.meta.hot) {
  import.meta.hot.accept("./App.jsx", (newModule) => {
    // Lógica customizada de HMR se necessário
  });
}
```

## 📁 Estrutura de Assets

### 1. **Assets Estáticos**

```
public/
├── favicon.ico
├── manifest.json
├── sw.js
└── icons/
    ├── icon-192x192.png
    └── icon-512x512.png
```

### 2. **Assets Dinâmicos**

```javascript
// Importação de assets dinâmicos
import logoUrl from "@/assets/logo.png";
import "./component.scss";

// URL de asset
const iconUrl = new URL("../assets/icon.png", import.meta.url).href;
```

## 🌍 Variáveis de Ambiente

### 1. **Arquivos de Ambiente**

```
.env                # Todas as environments
.env.local          # Local (ignorado pelo git)
.env.development    # Desenvolvimento
.env.production     # Produção
```

### 2. **Uso de Variáveis**

```javascript
// Apenas variáveis com prefixo VITE_ são expostas
const apiUrl = import.meta.env.VITE_API_URL;
const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;
const mode = import.meta.env.MODE;

// Exemplo de .env
// VITE_API_URL=https://pokeapi.co/api/v2
// VITE_APP_TITLE=Pokédex App
```

## 🧪 Configuração de Testes

### 1. **Vitest Integration**

```javascript
// vite.config.js
export default defineConfig({
  test: {
    globals: true, // APIs globais (describe, it, expect)
    environment: "jsdom", // Ambiente DOM
    setupFiles: ["./src/test/setup.js"], // Setup global
    css: true, // Processar CSS nos testes
    coverage: {
      reporter: ["text", "html"], // Relatórios de coverage
      exclude: ["node_modules/", "src/test/", "**/*.config.js", "**/*.d.ts"],
    },
  },
});
```

### 2. **Setup de Testes**

```javascript
// src/test/setup.js
import "@testing-library/jest-dom";
import { beforeEach, vi } from "vitest";

// Mock global do fetch
global.fetch = vi.fn();

// Cleanup após cada teste
beforeEach(() => {
  vi.clearAllMocks();
  document.body.innerHTML = "";
});
```

## 🔧 Plugins Adicionais

### 1. **Plugins Recomendados**

```javascript
// Expansões futuras possíveis
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      // Configuração PWA
    }),
    visualizer({
      filename: "dist/stats.html",
      open: true,
    }),
  ],
});
```

### 2. **Plugin de Análise**

```bash
# Instalar plugin de análise de bundle
npm install --save-dev rollup-plugin-visualizer

# Executar build com análise
npm run build
```

## 🛠️ Troubleshooting

### 1. **Problemas Comuns**

#### **Import Paths**

```javascript
// ❌ Erro comum
import Component from "./Component"; // Sem extensão

// ✅ Correto
import Component from "./Component.jsx"; // Com extensão
```

#### **Alias não funciona**

```javascript
// Verificar se alias está configurado em vite.config.js
// E se o caminho está correto

// ❌
import { hook } from "@hooks/useAuth.js";

// ✅
import { hook } from "@/features/auth/hooks/useAuth.js";
```

### 2. **Debug de Configuração**

```javascript
// Adicionar logs de debug
export default defineConfig(({ command, mode }) => {
  console.log("Command:", command); // 'build' | 'serve'
  console.log("Mode:", mode); // 'development' | 'production'

  return {
    // configuração
  };
});
```

### 3. **Performance Issues**

```javascript
// Configurações para projetos grandes
export default defineConfig({
  optimizeDeps: {
    include: ["large-dependency"],
    exclude: ["optional-dependency"],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
    },
  },
});
```

## 📊 Comandos Úteis

### 1. **Desenvolvimento**

```bash
# Desenvolvimento com porta específica
npm run dev -- --port 3000

# Desenvolvimento com host específico
npm run dev -- --host 0.0.0.0

# Build com modo específico
npm run build -- --mode staging
```

### 2. **Análise e Debug**

```bash
# Preview com porta específica
npm run preview -- --port 4000

# Build com análise de bundle
npm run build && npx vite-bundle-analyzer dist
```

## ✅ Boas Práticas

### 1. **Organização**

- Use aliases consistentemente
- Mantenha arquivos de configuração limpos
- Documente configurações customizadas

### 2. **Performance**

- Configure `optimizeDeps` para dependências grandes
- Use code splitting adequado
- Monitore tamanho do bundle

### 3. **Desenvolvimento**

- Use variáveis de ambiente adequadamente
- Configure proxy para APIs locais
- Aproveite HMR para desenvolvimento rápido

---

_Esta documentação reflete a configuração atual do Vite no projeto e será atualizada conforme modificações forem feitas._
