import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  IconButton,
  Tooltip,
  CardActionArea,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { route } from "preact-router";
import { useFavorites } from "../hooks/useFavorites.js";

export const PokemonCard = ({ pokemon }) => {
  const { togglePokemonFavorite, isFavorite } = useFavorites();

  if (!pokemon) {
    return (
      <Card
        className="pokemon-card"
        sx={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <CardContent>
          <Typography variant="h6">Pokémon não encontrado</Typography>
        </CardContent>
      </Card>
    );
  }

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
    <Card
      className="pokemon-card"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={
              pokemon.imageUrl ||
              pokemon.sprites?.front_default ||
              "/placeholder-pokemon.png"
            }
            alt={pokemon.name}
            className="pokemon-card__image"
            sx={{
              objectFit: "contain",
              backgroundColor: "#f5f5f5",
              padding: 1,
            }}
          />
        </Box>

        <CardContent className="pokemon-card__content">
          <Typography
            variant="h6"
            component="h2"
            className="pokemon-card__title"
          >
            {pokemon.name
              ? pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
              : "Pokémon"}
          </Typography>

          <Typography variant="body2" className="pokemon-card__subtitle">
            #{pokemon.id ? pokemon.id.toString().padStart(3, "0") : "000"}
          </Typography>

          <Box className="pokemon-card__types">
            {pokemon.types?.map((type) => (
              <Chip
                key={type.slot}
                label={
                  type.type?.name
                    ? type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)
                    : "Normal"
                }
                size="small"
                sx={{
                  backgroundColor: getTypeColor(type.type?.name),
                  color: "white",
                  fontWeight: "bold",
                }}
                className={`pokemon-card__type pokemon-type--${
                  type.type?.name || "normal"
                }`}
              />
            )) || (
              <Chip
                label="Normal"
                size="small"
                sx={{
                  backgroundColor: getTypeColor("normal"),
                  color: "white",
                  fontWeight: "bold",
                }}
                className="pokemon-card__type pokemon-type--normal"
              />
            )}
          </Box>

          <Box className="pokemon-card__stats">
            <Typography variant="body2">
              Altura:{" "}
              {pokemon.heightInMeters
                ? pokemon.heightInMeters.toFixed(1)
                : pokemon.height
                  ? (pokemon.height / 10).toFixed(1)
                  : "0.0"}
              m
            </Typography>
            <Typography variant="body2">
              Peso:{" "}
              {pokemon.weightInKg
                ? pokemon.weightInKg.toFixed(1)
                : pokemon.weight
                  ? (pokemon.weight / 10).toFixed(1)
                  : "0.0"}
              kg
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <Tooltip
          title={
            pokemonIsFavorite
              ? "Remover dos favoritos"
              : "Adicionar aos favoritos"
          }
        >
          <IconButton
            sx={{
              bgcolor: "background.paper",
              "&:hover": {
                bgcolor: "background.paper",
              },
            }}
            onClick={handleFavoriteClick}
          >
            {pokemonIsFavorite ? (
              <Favorite color="error" />
            ) : (
              <FavoriteBorder />
            )}
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};
