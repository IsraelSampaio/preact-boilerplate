# 🚀 Deploy e Produção

## 📋 Visão Geral

Este documento detalha estratégias e configurações para deploy da aplicação Pokémon em diferentes ambientes de produção, incluindo otimizações, configurações de servidor e monitoramento.

## 🏗️ Build de Produção

### 1. **Comando de Build**

```bash
# Build otimizado para produção
npm run build

# Preview do build localmente
npm run preview
```

### 2. **Estrutura do Build**

```
dist/
├── index.html              # HTML principal
├── assets/
│   ├── index-[hash].js     # JavaScript bundle
│   ├── index-[hash].css    # CSS bundle
│   └── vendor-[hash].js    # Vendor bundle
├── icons/                  # Ícones PWA
│   ├── icon-192x192.png
│   └── icon-512x512.png
├── manifest.json           # Manifesto PWA
└── sw.js                   # Service Worker
```

### 3. **Otimizações de Build**

```javascript
// vite.config.js - Configurações de produção
export default defineConfig({
  build: {
    target: "esnext",
    minify: "esbuild",
    sourcemap: false, // Desabilitado em produção
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["preact", "preact-router"],
          mui: ["@mui/material", "@mui/icons-material", "@emotion/react"],
          redux: ["@reduxjs/toolkit", "react-redux"],
          utils: ["i18next", "react-i18next"],
        },
      },
    },
  },
});
```

## 🌐 Plataformas de Deploy

### 1. **Vercel** (Recomendado)

#### **Configuração Automática**

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

#### **Deploy Steps**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login
vercel login

# 3. Deploy
vercel --prod
```

### 2. **Netlify**

#### **Configuração**

```toml
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 3. **GitHub Pages**

#### **GitHub Actions Workflow**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:coverage

      - name: Build
        run: npm run build
        env:
          VITE_BASE_URL: /boilerplate-preact/

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

#### **Configuração Base URL**

```javascript
// vite.config.js
export default defineConfig({
  base: process.env.NODE_ENV === "production" ? "/boilerplate-preact/" : "/",
  // resto da configuração
});
```

### 4. **Docker**

#### **Dockerfile**

```dockerfile
# Dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### **Nginx Configuration**

```nginx
# nginx.conf
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Service Worker - no cache
        location /sw.js {
            expires off;
            add_header Cache-Control "public, max-age=0, must-revalidate";
        }

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    }
}
```

#### **Docker Commands**

```bash
# Build image
docker build -t pokemon-app .

# Run container
docker run -p 80:80 pokemon-app

# Docker Compose
version: '3.8'
services:
  app:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

## 🔧 Variáveis de Ambiente

### 1. **Configuração por Ambiente**

```bash
# .env.production
VITE_API_URL=https://pokeapi.co/api/v2
VITE_APP_TITLE=Pokédex - Produção
VITE_ENABLE_ANALYTICS=true
VITE_SENTRY_DSN=your-sentry-dsn

# .env.staging
VITE_API_URL=https://staging-api.example.com
VITE_APP_TITLE=Pokédex - Staging
VITE_ENABLE_ANALYTICS=false
```

### 2. **Uso no Código**

```javascript
// src/config/environment.js
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || "https://pokeapi.co/api/v2",
  appTitle: import.meta.env.VITE_APP_TITLE || "Pokédex",
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === "true",
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
};
```

## 📊 Monitoramento e Analytics

### 1. **Performance Monitoring**

```javascript
// src/utils/performance.js
export const trackPageLoad = () => {
  if ("performance" in window) {
    const loadTime =
      window.performance.timing.loadEventEnd -
      window.performance.timing.navigationStart;
    console.log("Page load time:", loadTime);

    // Enviar para analytics
    if (config.enableAnalytics) {
      // gtag('event', 'page_load_time', { value: loadTime });
    }
  }
};

// Web Vitals
export const trackWebVitals = async () => {
  if (config.enableAnalytics) {
    const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import(
      "web-vitals"
    );

    getCLS(console.log);
    getFID(console.log);
    getFCP(console.log);
    getLCP(console.log);
    getTTFB(console.log);
  }
};
```

### 2. **Error Tracking**

```javascript
// src/utils/errorTracking.js
export const initErrorTracking = () => {
  window.addEventListener("error", (event) => {
    console.error("Global error:", event.error);

    // Enviar para serviço de error tracking
    if (config.enableAnalytics) {
      // Sentry, LogRocket, etc.
    }
  });

  window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);

    if (config.enableAnalytics) {
      // Enviar erro
    }
  });
};
```

## 🔒 Segurança

### 1. **Content Security Policy**

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://pokeapi.co;
"
/>
```

### 2. **Cabeçalhos de Segurança**

```javascript
// Configuração do servidor
const securityHeaders = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
};
```

## ⚡ Performance

### 1. **Bundle Analysis**

```bash
# Analisar tamanho do bundle
npm install --save-dev rollup-plugin-visualizer

# Adicionar ao vite.config.js
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    // outros plugins
    visualizer({
      filename: 'dist/stats.html',
      open: true
    })
  ]
});
```

### 2. **Lazy Loading**

```javascript
// src/App.jsx - Componentes lazy
import { lazy, Suspense } from "preact/compat";

const HomePage = lazy(() => import("@/features/pokemon/pages/HomePage.jsx"));
const PokemonListPage = lazy(
  () => import("@/features/pokemon/pages/PokemonListPage.jsx"),
);

export const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Router>
      <HomePage path="/" />
      <PokemonListPage path="/pokemon" />
    </Router>
  </Suspense>
);
```

### 3. **Resource Hints**

```html
<!-- index.html -->
<link rel="dns-prefetch" href="//pokeapi.co" />
<link rel="preconnect" href="https://pokeapi.co" />
<link rel="prefetch" href="/icons/icon-192x192.png" />
```

## 🚀 CI/CD Pipeline

### 1. **GitHub Actions Completo**

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Test
        run: npm run test:coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3

  build:
    needs: test
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/

      - name: Deploy to production
        run: |
          # Deploy logic aqui
          echo "Deploying to production..."
```

## ✅ Checklist de Deploy

### 1. **Pré-Deploy**

- [ ] Todos os testes passando
- [ ] Lint sem erros
- [ ] Build funcionando
- [ ] Variáveis de ambiente configuradas
- [ ] Service Worker funcionando
- [ ] PWA instalável

### 2. **Configuração de Servidor**

- [ ] Redirecionamentos SPA configurados
- [ ] Cabeçalhos de segurança
- [ ] Cache de assets estáticos
- [ ] Compressão gzip/brotli
- [ ] HTTPS configurado

### 3. **Pós-Deploy**

- [ ] Aplicação carregando corretamente
- [ ] PWA funcionando
- [ ] Service Worker ativo
- [ ] Analytics funcionando
- [ ] Monitoramento ativo

## 🔍 Troubleshooting

### 1. **Problemas Comuns**

#### **Build Falha**

```bash
# Limpar cache e node_modules
rm -rf node_modules dist
npm ci
npm run build
```

#### **Rotas 404 em Produção**

```nginx
# Configurar fallback para SPA
try_files $uri $uri/ /index.html;
```

#### **Service Worker Não Atualiza**

```javascript
// Forçar atualização do SW
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.update());
  });
}
```

### 2. **Debug de Produção**

```javascript
// Habilitar logs apenas em desenvolvimento
if (import.meta.env.DEV) {
  console.log("Debug info");
}

// Source maps para debug em produção (quando necessário)
// vite.config.js
export default defineConfig({
  build: {
    sourcemap: process.env.ENABLE_SOURCEMAP === "true",
  },
});
```

---

_Esta documentação deve ser atualizada sempre que houver mudanças nas configurações de deploy ou infraestrutura._
