/**
 * DTOs do Redux compartilhados
 * Contém DTOs para estado global da aplicação
 */

/**
 * DTO para estado da UI
 */
export class UIStateDTO {
  constructor(data = {}) {
    this.sidebarOpen = data.sidebarOpen || false;
    this.theme = data.theme || 'light';
    this.loading = data.loading || false;
    this.notifications = (data.notifications || []).map(notif => new NotificationDTO(notif));
    this.modal = data.modal ? new ModalDTO(data.modal) : null;
    this.drawer = data.drawer ? new DrawerDTO(data.drawer) : null;
  }

  /**
   * Verifica se está em modo escuro
   * @returns {boolean}
   */
  isDarkMode() {
    return this.theme === 'dark';
  }

  /**
   * Obtém notificações não lidas
   * @returns {Array<NotificationDTO>}
   */
  getUnreadNotifications() {
    return this.notifications.filter(notif => !notif.read);
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      sidebarOpen: this.sidebarOpen,
      theme: this.theme,
      loading: this.loading,
      notifications: this.notifications.map(notif => notif.toPlainObject()),
      modal: this.modal ? this.modal.toPlainObject() : null,
      drawer: this.drawer ? this.drawer.toPlainObject() : null
    };
  }
}

/**
 * DTO para notificação
 */
export class NotificationDTO {
  constructor(data = {}) {
    this.id = data.id || Date.now().toString();
    this.type = data.type || 'info'; // 'success', 'error', 'warning', 'info'
    this.title = data.title || '';
    this.message = data.message || '';
    this.read = data.read || false;
    this.timestamp = data.timestamp || new Date().toISOString();
    this.duration = data.duration || 5000; // em ms
  }

  /**
   * Marca como lida
   */
  markAsRead() {
    this.read = true;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      message: this.message,
      read: this.read,
      timestamp: this.timestamp,
      duration: this.duration
    };
  }
}

/**
 * DTO para modal
 */
export class ModalDTO {
  constructor(data = {}) {
    this.isOpen = data.isOpen || false;
    this.type = data.type || 'default'; // 'confirm', 'alert', 'custom'
    this.title = data.title || '';
    this.content = data.content || '';
    this.confirmText = data.confirmText || 'Confirmar';
    this.cancelText = data.cancelText || 'Cancelar';
    this.onConfirm = data.onConfirm || null;
    this.onCancel = data.onCancel || null;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      isOpen: this.isOpen,
      type: this.type,
      title: this.title,
      content: this.content,
      confirmText: this.confirmText,
      cancelText: this.cancelText
    };
  }
}

/**
 * DTO para drawer
 */
export class DrawerDTO {
  constructor(data = {}) {
    this.isOpen = data.isOpen || false;
    this.anchor = data.anchor || 'left'; // 'left', 'right', 'top', 'bottom'
    this.width = data.width || 300;
    this.content = data.content || null;
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      isOpen: this.isOpen,
      anchor: this.anchor,
      width: this.width,
      content: this.content
    };
  }
}
