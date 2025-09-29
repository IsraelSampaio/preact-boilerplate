/**
 * Barrel exports - Ponto de entrada principal da aplicação
 * Segue Feature-Based Architecture com Container/Presentation pattern
 */

// Features
export * from './features/auth/index.js';
export * from './features/pokemon/index.js';
export * from './features/i18n/index.js';

// Shared/Common
export * from './features/shared/index.js';

// DTOs agora organizados por features - disponíveis através das features
// Para usar DTOs: import { PokemonDTO } from './features/pokemon';
// Para factory: import { DTOFactory } from './features/shared';

// Types (mantidos no nível superior por serem transversais)
export * from './types/index.js';
