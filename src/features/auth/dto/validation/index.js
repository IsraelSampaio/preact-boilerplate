/**
 * DTOs de validação para a feature Auth
 * Contém validadores específicos para autenticação
 */

/**
 * Validador para dados de autenticação
 */
export class AuthValidationDTO {
  /**
   * Valida email
   * @param {string} email
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateEmail(email) {
    if (!email) {
      return { isValid: false, error: "Email é obrigatório" };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Email inválido" };
    }

    return { isValid: true };
  }

  /**
   * Valida senha
   * @param {string} password
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validatePassword(password) {
    if (!password) {
      return { isValid: false, error: "Senha é obrigatória" };
    }

    if (password.length < 6) {
      return {
        isValid: false,
        error: "Senha deve ter pelo menos 6 caracteres",
      };
    }

    return { isValid: true };
  }

  /**
   * Valida dados de login
   * @param {Object} loginData
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateLogin(loginData) {
    const errors = {};
    let isValid = true;

    const emailValidation = this.validateEmail(loginData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
      isValid = false;
    }

    const passwordValidation = this.validatePassword(loginData.password);
    if (!passwordValidation.isValid) {
      errors.password = passwordValidation.error;
      isValid = false;
    }

    return { isValid, errors };
  }

  /**
   * Valida dados de usuário
   * @param {Object} userData
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateUser(userData) {
    const errors = {};
    let isValid = true;

    // Validar email
    const emailValidation = this.validateEmail(userData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error;
      isValid = false;
    }

    // Validar nome
    if (!userData.name) {
      errors.name = "Nome é obrigatório";
      isValid = false;
    } else if (userData.name.length < 2) {
      errors.name = "Nome deve ter pelo menos 2 caracteres";
      isValid = false;
    } else if (userData.name.length > 100) {
      errors.name = "Nome deve ter no máximo 100 caracteres";
      isValid = false;
    }

    // Validar role
    const validRoles = ["user", "admin", "moderator"];
    if (userData.role && !validRoles.includes(userData.role)) {
      errors.role = `Role deve ser um dos seguintes: ${validRoles.join(", ")}`;
      isValid = false;
    }

    return { isValid, errors };
  }
}
