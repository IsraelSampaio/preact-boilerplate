// Service Worker para Pokémon App
// Versão do cache - incrementar quando houver mudanças
const CACHE_VERSION = "pokemon-app-v1.0.0";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE = `${CACHE_VERSION}-dynamic`;
const API_CACHE = `${CACHE_VERSION}-api`;

// Arquivos para cache estático (sempre cached)
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
  // Adicionar outros assets estáticos conforme necessário
];

// URLs da API para cache dinâmico
const _API_URLS = [
  "https://pokeapi.co/api/v2/pokemon",
  "https://pokeapi.co/api/v2/type",
];

// Estratégias de cache
const CACHE_STRATEGIES = {
  CACHE_FIRST: "cache-first",
  NETWORK_FIRST: "network-first",
  STALE_WHILE_REVALIDATE: "stale-while-revalidate",
  NETWORK_ONLY: "network-only",
  CACHE_ONLY: "cache-only",
};

// Configuração de recursos e suas estratégias
const RESOURCE_CONFIG = {
  // Assets estáticos - Cache First
  static: {
    pattern: /\.(js|css|png|jpg|jpeg|gif|svg|woff2?|ttf)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
  },
  // API do Pokémon - Stale While Revalidate
  pokemon_api: {
    pattern: /^https:\/\/pokeapi\.co\/api\/v2\//,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: API_CACHE,
  },
  // Páginas - Network First
  pages: {
    pattern: /^https?:\/\/.*\/(pokemon|favorites|comparison|about)/,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE,
  },
  // Imagens de Pokémon - Cache First
  pokemon_images: {
    pattern: /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\//,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: API_CACHE,
  },
};

// Instalar Service Worker
self.addEventListener("install", (event) => {
  console.log("[SW] Installing Service Worker...", CACHE_VERSION);

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Caching static assets");
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log("[SW] Static assets cached successfully");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("[SW] Failed to cache static assets:", error);
      }),
  );
});

// Ativar Service Worker
self.addEventListener("activate", (event) => {
  console.log("[SW] Activating Service Worker...", CACHE_VERSION);

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE &&
              cacheName !== DYNAMIC_CACHE &&
              cacheName !== API_CACHE
            ) {
              console.log("[SW] Deleting old cache:", cacheName);
              return caches.delete(cacheName);
            }
          }),
        );
      })
      .then(() => {
        console.log("[SW] Service Worker activated successfully");
        return self.clients.claim();
      }),
  );
});

// Interceptar requisições
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const _url = new URL(request.url);

  // Ignorar requisições não-GET
  if (request.method !== "GET") {
    return;
  }

  // Determinar estratégia de cache baseada na URL
  const strategy = getStrategy(request.url);

  if (strategy) {
    event.respondWith(handleRequest(request, strategy));
  }
});

// Determinar estratégia baseada na URL
function getStrategy(url) {
  for (const [_name, config] of Object.entries(RESOURCE_CONFIG)) {
    if (config.pattern.test(url)) {
      return config;
    }
  }

  // Estratégia padrão para outras requisições
  return {
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: DYNAMIC_CACHE,
  };
}

// Manipular requisições baseado na estratégia
async function handleRequest(request, config) {
  const { strategy, cache: cacheName } = config;

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName);

    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName);

    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName);

    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);

    case CACHE_STRATEGIES.CACHE_ONLY:
      return caches.match(request);

    default:
      return networkFirst(request, cacheName);
  }
}

// Estratégia Cache First
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  if (cached) {
    console.log("[SW] Serving from cache:", request.url);
    return cached;
  }

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      console.log("[SW] Caching new resource:", request.url);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("[SW] Network request failed:", error);
    return new Response("Offline content not available", {
      status: 503,
      statusText: "Service Unavailable",
    });
  }
}

// Estratégia Network First
async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request);
    if (response.status === 200) {
      console.log("[SW] Caching from network:", request.url);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log("[SW] Network failed, trying cache:", request.url);
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Fallback para página offline se for uma navegação
    if (request.mode === "navigate") {
      return (
        caches.match("/offline.html") ||
        new Response("Offline", {
          status: 503,
          statusText: "Service Unavailable",
        })
      );
    }

    throw error;
  }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // Buscar nova versão em background
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.status === 200) {
        console.log("[SW] Updating cache in background:", request.url);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch((error) => {
      console.error("[SW] Background fetch failed:", error);
    });

  // Retornar cache imediatamente se disponível, senão aguardar network
  if (cached) {
    console.log("[SW] Serving stale content:", request.url);
    return cached;
  }

  return fetchPromise;
}

// Limpar caches antigos periodicamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "CLEAR_CACHE") {
    event.waitUntil(clearOldCache());
  }

  if (event.data && event.data.type === "GET_CACHE_SIZE") {
    event.waitUntil(
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ cacheSize: size });
      }),
    );
  }
});

// Limpar cache antigo
async function clearOldCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter((name) => !name.includes(CACHE_VERSION));

  await Promise.all(oldCaches.map((name) => caches.delete(name)));
  console.log("[SW] Old caches cleared:", oldCaches);
}

// Obter tamanho do cache
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const requests = await cache.keys();

    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return totalSize;
}

// Notificar clientes sobre atualizações
self.addEventListener("controllerchange", () => {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "SW_UPDATED",
        message: "Service Worker atualizado! Recarregue para ver as novidades.",
      });
    });
  });
});

console.log("[SW] Service Worker registered successfully:", CACHE_VERSION);
