/**
 * Barrel exports - Ponto de entrada principal da aplicação
 * Segue Feature-Based Architecture com Container/Presentation pattern
 */

// Features
export * from "./features/auth/index.js";
export * from "./features/pokemon/index.js";
export * from "./features/i18n/index.js";

// Shared/Common
export * from "./features/shared/index.js";
export * from "./types/index.js";
