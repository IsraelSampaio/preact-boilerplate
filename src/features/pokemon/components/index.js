// Exporta componentes containers (hook pattern - principais)
export { PokemonCardContainer as PokemonCard } from "./containers/PokemonCardContainer.jsx";

// Exporta componentes de apresentação para uso direto quando necessário
export { PokemonCardPresentation } from "./presentations/PokemonCardPresentation.jsx";

// Re-exporta componentes existentes que ainda não foram refatorados
export { PokemonFilters } from "./PokemonFilters.jsx";
export { PokemonList } from "./PokemonList.jsx";
