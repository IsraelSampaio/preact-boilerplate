/**
 * Utilitário para registro e gerenciamento do Service Worker
 */

const isProduction = import.meta.env.PROD;
const SW_URL = "/sw.js";

/**
 * Registra o Service Worker
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export const registerServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Workers não são suportados neste navegador");
    return null;
  }

  if (!isProduction) {
    console.log("Service Worker desabilitado em desenvolvimento");
    return null;
  }

  try {
    console.log("Registrando Service Worker...");
    const registration = await navigator.serviceWorker.register(SW_URL, {
      scope: "/",
    });

    console.log("Service Worker registrado com sucesso:", registration);

    // Verificar atualizações
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      console.log("Nova versão do Service Worker encontrada");

      newWorker?.addEventListener("statechange", () => {
        if (
          newWorker.state === "installed" &&
          navigator.serviceWorker.controller
        ) {
          console.log("Nova versão do Service Worker instalada");
          showUpdateNotification();
        }
      });
    });

    // Escutar mensagens do Service Worker
    navigator.serviceWorker.addEventListener(
      "message",
      handleServiceWorkerMessage,
    );

    return registration;
  } catch (error) {
    console.error("Erro ao registrar Service Worker:", error);
    return null;
  }
};

/**
 * Remove o registro do Service Worker
 * @returns {Promise<boolean>}
 */
export const unregisterServiceWorker = async () => {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      const result = await registration.unregister();
      console.log("Service Worker removido:", result);
      return result;
    }
    return false;
  } catch (error) {
    console.error("Erro ao remover Service Worker:", error);
    return false;
  }
};

/**
 * Verifica se há atualizações do Service Worker
 * @returns {Promise<boolean>}
 */
export const checkForUpdates = async () => {
  if (!("serviceWorker" in navigator)) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      console.log("Verificação de atualização do Service Worker concluída");
      return true;
    }
    return false;
  } catch (error) {
    console.error("Erro ao verificar atualizações do Service Worker:", error);
    return false;
  }
};

/**
 * Obtém o tamanho do cache
 * @returns {Promise<number>}
 */
export const getCacheSize = async () => {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
    return 0;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();

    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.cacheSize || 0);
    };

    navigator.serviceWorker.controller.postMessage({ type: "GET_CACHE_SIZE" }, [
      messageChannel.port2,
    ]);
  });
};

/**
 * Limpa o cache antigo
 * @returns {Promise<void>}
 */
export const clearCache = async () => {
  if (!("serviceWorker" in navigator) || !navigator.serviceWorker.controller) {
    return;
  }

  navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
  console.log("Solicitação de limpeza de cache enviada");
};

/**
 * Verifica se a aplicação está rodando offline
 * @returns {boolean}
 */
export const isOffline = () => {
  return !navigator.onLine;
};

/**
 * Verifica se a aplicação é um PWA instalado
 * @returns {boolean}
 */
export const isInstalled = () => {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.navigator.standalone ||
    document.referrer.includes("android-app://")
  );
};

/**
 * Mostra prompt de instalação do PWA
 * @param {Event} installPromptEvent Evento de instalação
 * @returns {Promise<boolean>}
 */
export const showInstallPrompt = async (installPromptEvent) => {
  if (!installPromptEvent) {
    console.warn("Evento de instalação não disponível");
    return false;
  }

  try {
    // Mostrar prompt de instalação
    installPromptEvent.prompt();

    // Aguardar escolha do usuário
    const { outcome } = await installPromptEvent.userChoice;

    console.log("Resultado da instalação:", outcome);
    return outcome === "accepted";
  } catch (error) {
    console.error("Erro ao mostrar prompt de instalação:", error);
    return false;
  }
};

/**
 * Manipula mensagens do Service Worker
 * @param {MessageEvent} event Evento de mensagem
 */
const handleServiceWorkerMessage = (event) => {
  const { data } = event;

  switch (data?.type) {
    case "SW_UPDATED":
      console.log("Service Worker atualizado:", data.message);
      showUpdateNotification();
      break;

    default:
      console.log("Mensagem do Service Worker:", data);
  }
};

/**
 * Mostra notificação de atualização disponível
 */
const showUpdateNotification = () => {
  // Criar notificação personalizada ou usar toast
  const notification = document.createElement("div");
  notification.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1976d2;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10000;
      max-width: 300px;
    ">
      <div style="margin-bottom: 8px;">
        <strong>Atualização Disponível!</strong>
      </div>
      <div style="margin-bottom: 12px; font-size: 14px;">
        Uma nova versão da aplicação está disponível.
      </div>
      <button onclick="window.location.reload()" style="
        background: rgba(255,255,255,0.2);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 8px;
      ">
        Atualizar
      </button>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: transparent;
        color: white;
        border: 1px solid rgba(255,255,255,0.3);
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      ">
        Depois
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Remover automaticamente após 10 segundos
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 10000);
};

/**
 * Configurar listeners para eventos de conexão
 */
export const setupConnectivityListeners = () => {
  window.addEventListener("online", () => {
    console.log("Aplicação online");
    showConnectivityStatus(true);
  });

  window.addEventListener("offline", () => {
    console.log("Aplicação offline");
    showConnectivityStatus(false);
  });
};

/**
 * Mostra status de conectividade
 * @param {boolean} isOnline Se está online
 */
const showConnectivityStatus = (isOnline) => {
  const message = isOnline
    ? "Conectado! Dados sincronizados."
    : "Offline. Funcionalidade limitada.";

  const color = isOnline ? "#4caf50" : "#ff9800";

  // Criar toast de status
  const toast = document.createElement("div");
  toast.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: ${color};
      color: white;
      padding: 12px 24px;
      border-radius: 24px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      z-index: 10000;
      font-size: 14px;
    ">
      ${message}
    </div>
  `;

  document.body.appendChild(toast);

  // Remover após 3 segundos
  setTimeout(() => {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 3000);
};

/**
 * Inicializar PWA
 * @returns {Promise<void>}
 */
export const initializePWA = async () => {
  // Registrar Service Worker
  await registerServiceWorker();

  // Configurar listeners de conectividade
  setupConnectivityListeners();

  // Verificar por atualizações periodicamente (a cada 30 minutos)
  if (isProduction) {
    setInterval(checkForUpdates, 30 * 60 * 1000);
  }

  console.log("PWA inicializado com sucesso");
};

// Auto-inicializar se não for importado como módulo
if (typeof window !== "undefined" && !window.__PWA_INITIALIZED__) {
  window.__PWA_INITIALIZED__ = true;
  document.addEventListener("DOMContentLoaded", initializePWA);
}
