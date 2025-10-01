import { route } from "preact-router";
import { useFavorites } from "../../hooks/useFavorites.js";
import { PokemonCardPresentation } from "../presentations/PokemonCardPresentation.jsx";

/**
 * Componente container do Pokemon Card (lógica de negócio)
 */
export const PokemonCardContainer = ({ pokemon }) => {
  const { togglePokemonFavorite, isFavorite } = useFavorites();

  const handleCardClick = () => {
    route(`/pokemon/${pokemon.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    togglePokemonFavorite(pokemon);
  };

  const pokemonIsFavorite = isFavorite(pokemon.id);

  const getTypeColor = (type) => {
    const colors = {
      normal: "#A8A878",
      fire: "#F08030",
      water: "#6890F0",
      electric: "#F8D030",
      grass: "#78C850",
      ice: "#98D8D8",
      fighting: "#C03028",
      poison: "#A040A0",
      ground: "#E0C068",
      flying: "#A890F0",
      psychic: "#F85888",
      bug: "#A8B820",
      rock: "#B8A038",
      ghost: "#705898",
      dragon: "#7038F8",
      dark: "#705848",
      steel: "#B8B8D0",
      fairy: "#EE99AC",
    };
    return colors[type] || "#A8A878";
  };

  return (
    <PokemonCardPresentation
      pokemon={pokemon}
      isFavorite={pokemonIsFavorite}
      onCardClick={handleCardClick}
      onFavoriteClick={handleFavoriteClick}
      getTypeColor={getTypeColor}
    />
  );
};
