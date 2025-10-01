/**
 * DTOs de validação compartilhados
 * Contém validadores genéricos e utilitários
 */

/**
 * Validador para dados de UI
 */
export class UIValidationDTO {
  /**
   * Valida tema
   * @param {string} theme
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateTheme(theme) {
    const validThemes = ["light", "dark", "auto"];

    if (!theme) {
      return { isValid: false, error: "Tema é obrigatório" };
    }

    if (!validThemes.includes(theme)) {
      return {
        isValid: false,
        error: `Tema deve ser um dos seguintes: ${validThemes.join(", ")}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida notificação
   * @param {Object} notification
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateNotification(notification) {
    const errors = {};
    let isValid = true;

    if (!notification.type) {
      errors.type = "Tipo da notificação é obrigatório";
      isValid = false;
    } else {
      const validTypes = ["success", "error", "warning", "info"];
      if (!validTypes.includes(notification.type)) {
        errors.type = `Tipo deve ser um dos seguintes: ${validTypes.join(
          ", ",
        )}`;
        isValid = false;
      }
    }

    if (!notification.message) {
      errors.message = "Mensagem é obrigatória";
      isValid = false;
    } else if (notification.message.length > 500) {
      errors.message = "Mensagem deve ter no máximo 500 caracteres";
      isValid = false;
    }

    if (notification.title && notification.title.length > 100) {
      errors.title = "Título deve ter no máximo 100 caracteres";
      isValid = false;
    }

    return { isValid, errors };
  }
}

/**
 * Validador genérico para formulários
 */
export class FormValidationDTO {
  /**
   * Valida campos obrigatórios
   * @param {Object} data
   * @param {Array<string>} requiredFields
   * @returns {Object} { isValid: boolean, errors: Object }
   */
  static validateRequired(data, requiredFields) {
    const errors = {};
    let isValid = true;

    requiredFields.forEach((field) => {
      if (
        !data[field] ||
        (typeof data[field] === "string" && data[field].trim() === "")
      ) {
        errors[field] = `${field} é obrigatório`;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  /**
   * Valida comprimento de string
   * @param {string} value
   * @param {number} min
   * @param {number} max
   * @param {string} fieldName
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateStringLength(value, min, max, fieldName) {
    if (value.length < min) {
      return {
        isValid: false,
        error: `${fieldName} deve ter pelo menos ${min} caracteres`,
      };
    }

    if (value.length > max) {
      return {
        isValid: false,
        error: `${fieldName} deve ter no máximo ${max} caracteres`,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida número
   * @param {number|string} value
   * @param {number} min
   * @param {number} max
   * @param {string} fieldName
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateNumber(value, min, max, fieldName) {
    const numValue = Number(value);

    if (isNaN(numValue)) {
      return {
        isValid: false,
        error: `${fieldName} deve ser um número válido`,
      };
    }

    if (numValue < min) {
      return {
        isValid: false,
        error: `${fieldName} deve ser pelo menos ${min}`,
      };
    }

    if (numValue > max) {
      return {
        isValid: false,
        error: `${fieldName} deve ser no máximo ${max}`,
      };
    }

    return { isValid: true };
  }

  /**
   * Valida URL
   * @param {string} url
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateUrl(url) {
    if (!url) {
      return { isValid: false, error: "URL é obrigatória" };
    }

    try {
      new URL(url);
      return { isValid: true };
    } catch {
      return { isValid: false, error: "URL inválida" };
    }
  }

  /**
   * Valida data
   * @param {string} date
   * @returns {Object} { isValid: boolean, error?: string }
   */
  static validateDate(date) {
    if (!date) {
      return { isValid: false, error: "Data é obrigatória" };
    }

    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: "Data inválida" };
    }

    return { isValid: true };
  }
}
