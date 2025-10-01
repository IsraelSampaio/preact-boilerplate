/**
 * DTOs da API para a feature Auth
 * Contém DTOs relacionados à comunicação de autenticação
 */

/**
 * DTO para erro da API
 */
export class ApiErrorDTO {
  constructor(error) {
    this.message = error.message || "Erro desconhecido";
    this.status = error.status || 500;
    this.code = error.code || "UNKNOWN_ERROR";
    this.timestamp = new Date().toISOString();
  }

  toInternal() {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      timestamp: this.timestamp,
    };
  }
}

/**
 * DTO para resposta de login da API
 */
export class LoginResponseDTO {
  constructor(data) {
    this.token = data.token || "";
    this.refreshToken = data.refreshToken || "";
    this.user = data.user || null;
    this.expiresIn = data.expiresIn || 3600;
  }

  toInternal() {
    return {
      token: this.token,
      refreshToken: this.refreshToken,
      user: this.user,
      expiresIn: this.expiresIn,
    };
  }
}

/**
 * DTO para dados de login enviados para API
 */
export class LoginRequestDTO {
  constructor(data) {
    this.email = data.email || "";
    this.password = data.password || ""; // gitleaks:allow
    this.rememberMe = data.rememberMe || false;
  }

  toApiFormat() {
    return {
      email: this.email,
      password: this.password,
      remember_me: this.rememberMe,
    };
  }
}
