/**
 * DTOs do Redux para a feature Auth
 * Contém DTOs para gerenciamento de estado de autenticação
 */

/**
 * DTO para estado da autenticação
 */
export class AuthStateDTO {
  constructor(data = {}) {
    this.user = data.user ? new UserDTO(data.user) : null;
    this.isAuthenticated = data.isAuthenticated || false;
    this.isLoading = data.isLoading || false;
    this.error = data.error || null;
  }

  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean}
   */
  isLoggedIn() {
    return this.isAuthenticated && this.user !== null;
  }

  /**
   * Obtém o nome do usuário
   * @returns {string}
   */
  getUserName() {
    return this.user ? this.user.name : 'Usuário';
  }

  /**
   * Converte para objeto simples para Redux
   * @returns {Object}
   */
  toPlainObject() {
    return {
      user: this.user ? this.user.toPlainObject() : null,
      isAuthenticated: this.isAuthenticated,
      isLoading: this.isLoading,
      error: this.error
    };
  }
}

/**
 * DTO para usuário
 */
export class UserDTO {
  constructor(data = {}) {
    this.id = data.id || '';
    this.email = data.email || '';
    this.name = data.name || '';
    this.avatar = data.avatar || null;
    this.role = data.role || 'user';
    this.createdAt = data.createdAt || new Date().toISOString();
    this.lastLogin = data.lastLogin || null;
  }

  /**
   * Obtém as iniciais do nome do usuário
   * @returns {string}
   */
  getInitials() {
    return this.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  /**
   * Verifica se o usuário é administrador
   * @returns {boolean}
   */
  isAdmin() {
    return this.role === 'admin';
  }

  /**
   * Converte para objeto simples
   * @returns {Object}
   */
  toPlainObject() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatar: this.avatar,
      role: this.role,
      createdAt: this.createdAt,
      lastLogin: this.lastLogin
    };
  }
}
