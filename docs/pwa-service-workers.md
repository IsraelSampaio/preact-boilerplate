# 📱 PWA e Service Workers

## 📋 Visão Geral

Este projeto implementa funcionalidades de **Progressive Web App (PWA)** com **Service Workers** para oferecer experiência similar a aplicações nativas, incluindo funcionalidades offline, cache inteligente e instalação no dispositivo.

## 🏗️ Arquitetura PWA

### 1. **Estrutura de Arquivos**

```
public/
├── manifest.json          # Manifesto PWA
└── sw.js                  # Service Worker

src/
├── components/
│   └── PWAInstallPrompt.jsx    # Componente de instalação
└── features/shared/utils/
    └── serviceWorker.js        # Utilitários PWA
```

### 2. **Manifesto PWA**

```json
// public/manifest.json
{
  "name": "Pokémon App - Preact",
  "short_name": "Pokédex",
  "description": "Aplicação Pokémon com Preact e Material-UI",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1976d2",
  "orientation": "portrait-primary",
  "categories": ["games", "entertainment"],
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/desktop.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "390x844",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ]
}
```

## ⚙️ Service Worker

### 1. **Configuração Básica**

```javascript
// public/sw.js
const CACHE_NAME = "pokemon-app-v1";
const urlsToCache = [
  "/",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  // Assets estáticos
];

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache aberto");
      return cache.addAll(urlsToCache);
    }),
  );
});

// Ativação do Service Worker
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Removendo cache antigo:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Interceptação de requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - retorna response
      if (response) {
        return response;
      }

      return fetch(event.request).then((response) => {
        // Verifica se temos uma response válida
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // Clona a response
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    }),
  );
});
```

## 🛠️ Utilitários PWA

### 1. **Service Worker Manager**

O arquivo `src/features/shared/utils/serviceWorker.js` contém todas as funcionalidades para gerenciar o PWA:

```javascript
// Principais funções disponíveis:

// Registrar Service Worker
export const registerServiceWorker = async () => {
  /* ... */
};

// Verificar atualizações
export const checkForUpdates = async () => {
  /* ... */
};

// Verificar se está offline
export const isOffline = () => {
  /* ... */
};

// Verificar se PWA está instalado
export const isInstalled = () => {
  /* ... */
};

// Mostrar prompt de instalação
export const showInstallPrompt = async (installPromptEvent) => {
  /* ... */
};

// Obter tamanho do cache
export const getCacheSize = async () => {
  /* ... */
};

// Limpar cache
export const clearCache = async () => {
  /* ... */
};

// Inicializar PWA
export const initializePWA = async () => {
  /* ... */
};
```

### 2. **Inicialização**

```javascript
// src/main.jsx
import { render } from "preact";
import { App } from "./App.jsx";
import "./styles/index.scss";
import { initializePWA } from "./features/shared/utils/serviceWorker.js";
import "./features/i18n/index.js";

// Renderizar aplicação
render(<App />, document.getElementById("app"));

// Inicializar PWA
initializePWA()
  .then(() => {
    console.log("PWA inicializado com sucesso");
  })
  .catch((error) => {
    console.error("Erro ao inicializar PWA:", error);
  });
```

## 🎨 Componente de Instalação

### 1. **PWAInstallPrompt**

```javascript
// src/components/PWAInstallPrompt.jsx
import { useState, useEffect } from "preact/hooks";
import {
  Button,
  Snackbar,
  Alert,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import { GetApp, Close } from "@mui/icons-material";
import {
  showInstallPrompt,
  isInstalled,
} from "@/features/shared/utils/serviceWorker.js";

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    // Verificar se PWA já está instalado
    setIsAppInstalled(isInstalled());

    // Listener para evento de instalação
    const handleBeforeInstallPrompt = (e) => {
      // Prevenir prompt automático
      e.preventDefault();
      setDeferredPrompt(e);

      // Mostrar banner se não estiver instalado
      if (!isInstalled()) {
        setShowInstallBanner(true);
      }
    };

    // Listener para quando app é instalado
    const handleAppInstalled = () => {
      console.log("PWA foi instalado");
      setIsAppInstalled(true);
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    const wasInstalled = await showInstallPrompt(deferredPrompt);
    if (wasInstalled) {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    }
  };

  const handleCloseBanner = () => {
    setShowInstallBanner(false);
    // Não mostrar novamente nesta sessão
    sessionStorage.setItem("pwa-install-dismissed", "true");
  };

  // Não mostrar se já está instalado ou foi dispensado
  if (
    isAppInstalled ||
    sessionStorage.getItem("pwa-install-dismissed") ||
    !showInstallBanner
  ) {
    return null;
  }

  return (
    <Snackbar
      open={showInstallBanner}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      sx={{ zIndex: 9999 }}
    >
      <Alert
        severity="info"
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              color="inherit"
              size="small"
              startIcon={<GetApp />}
              onClick={handleInstallClick}
              sx={{ whiteSpace: "nowrap" }}
            >
              Instalar
            </Button>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleCloseBanner}
            >
              <Close fontSize="small" />
            </IconButton>
          </Box>
        }
        sx={{ alignItems: "center" }}
      >
        <Box>
          <Typography variant="body2" component="div">
            <strong>Instalar Pokédex</strong>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Acesse rapidamente sem abrir o navegador
          </Typography>
        </Box>
      </Alert>
    </Snackbar>
  );
};
```

## 🔄 Estratégias de Cache

### 1. **Cache First (Offline First)**

```javascript
// Para recursos estáticos
self.addEventListener("fetch", (event) => {
  if (
    event.request.destination === "style" ||
    event.request.destination === "script" ||
    event.request.destination === "image"
  ) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      }),
    );
  }
});
```

### 2. **Network First (API Calls)**

```javascript
// Para chamadas de API
self.addEventListener("fetch", (event) => {
  if (event.request.url.includes("/api/")) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          // Cache successful responses
          if (networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Fallback para cache em caso de falha de rede
          return caches.match(event.request);
        }),
    );
  }
});
```

### 3. **Stale While Revalidate**

```javascript
// Para dados que mudam frequentemente
const staleWhileRevalidate = (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    }),
  );
};
```

## 📱 Funcionalidades Offline

### 1. **Detecção de Status de Rede**

```javascript
// Hook para status de conectividade
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return isOnline;
};
```

### 2. **Página Offline**

```javascript
// Componente para quando está offline
export const OfflinePage = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        textAlign: "center",
        p: 3,
      }}
    >
      <Typography variant="h4" gutterBottom>
        📱 {t("offline.title", "Modo Offline")}
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        {t(
          "offline.message",
          "Você está offline. Algumas funcionalidades podem estar limitadas.",
        )}
      </Typography>
      <Button
        variant="contained"
        onClick={() => window.location.reload()}
        sx={{ mt: 2 }}
      >
        {t("offline.retry", "Tentar Novamente")}
      </Button>
    </Box>
  );
};
```

## 🔧 Configuração de Build

### 1. **Vite PWA Plugin (Futuro)**

```javascript
// vite.config.js (expansão futura)
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
      },
      includeAssets: ["favicon.ico", "apple-touch-icon.png"],
      manifest: {
        name: "Pokémon App - Preact",
        short_name: "Pokédex",
        description: "Aplicação Pokémon com Preact e Material-UI",
        theme_color: "#1976d2",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
```

## ✅ Boas Práticas

### 1. **Performance**

- Use cache strategies apropriadas para cada tipo de recurso
- Implemente lazy loading para recursos não críticos
- Monitore tamanho do cache

### 2. **UX Offline**

- Forneça feedback claro sobre status de conectividade
- Implemente funcionalidades offline essenciais
- Sincronize dados quando voltar online

### 3. **Atualizações**

- Notifique usuários sobre atualizações disponíveis
- Permita controle manual de atualizações
- Gerencie cache adequadamente

### 4. **Segurança**

- Use HTTPS em produção
- Valide requests no Service Worker
- Implemente CSP adequado

## 🧪 Testabilidade

### 1. **Testes de Service Worker**

```javascript
// src/test/serviceWorker.test.js
describe("Service Worker", () => {
  beforeEach(() => {
    // Mock Service Worker APIs
    global.self = {
      addEventListener: vi.fn(),
      skipWaiting: vi.fn(),
    };
    global.caches = {
      open: vi.fn(),
      match: vi.fn(),
      keys: vi.fn(),
    };
  });

  it("should register service worker", async () => {
    const registration = await registerServiceWorker();
    expect(registration).toBeDefined();
  });

  it("should detect offline status", () => {
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      value: false,
    });

    expect(isOffline()).toBe(true);
  });
});
```

### 2. **Testes de Componentes PWA**

```javascript
describe("PWAInstallPrompt", () => {
  it("should show install prompt when available", () => {
    render(<PWAInstallPrompt />);

    // Simular evento beforeinstallprompt
    const event = new CustomEvent("beforeinstallprompt");
    window.dispatchEvent(event);

    expect(screen.getByText("Instalar")).toBeInTheDocument();
  });
});
```

## 📊 Métricas e Monitoramento

### 1. **Performance Metrics**

- Tempo de carregamento offline
- Taxa de cache hit/miss
- Tamanho do cache usado

### 2. **Analytics PWA**

- Taxa de instalação
- Uso offline vs online
- Engajamento com PWA

### 3. **Debugging**

- Use Chrome DevTools → Application → Service Workers
- Monitore Cache Storage
- Analise Network requests

## 🚀 Expansões Futuras

### 1. **Background Sync**

- Sincronização de dados offline
- Queue de requests
- Notificações push

### 2. **Web Share API**

- Compartilhamento nativo
- Integração com SO

### 3. **Advanced Caching**

- Cache invalidation inteligente
- Predictive caching
- Selective caching

---

_Esta documentação reflete a implementação atual de PWA no projeto e será atualizada conforme novas funcionalidades forem adicionadas._
