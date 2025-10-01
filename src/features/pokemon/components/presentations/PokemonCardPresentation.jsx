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

/**
 * Componente de apresentação do Pokemon Card (apenas UI)
 */
export const PokemonCardPresentation = ({
  pokemon,
  isFavorite,
  onCardClick,
  onFavoriteClick,
  getTypeColor,
}) => {
  return (
    <Card
      className="pokemon-card"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      <CardActionArea onClick={onCardClick}>
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={pokemon.sprites?.front_default || "/placeholder-pokemon.png"}
            alt={pokemon.name}
            className="pokemon-card__image"
          />
        </Box>

        <CardContent className="pokemon-card__content">
          <Typography
            variant="h6"
            component="h2"
            className="pokemon-card__title"
          >
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>

          <Typography variant="body2" className="pokemon-card__subtitle">
            #{pokemon.id.toString().padStart(3, "0")}
          </Typography>

          <Box className="pokemon-card__types">
            {pokemon.types?.map((type) => (
              <Chip
                key={type.slot}
                label={
                  type.type.name.charAt(0).toUpperCase() +
                  type.type.name.slice(1)
                }
                size="small"
                className={`pokemon-card__type pokemon-type--${type.type.name}`}
                sx={{
                  backgroundColor: getTypeColor(type.type.name),
                  color: "white",
                }}
              />
            ))}
          </Box>

          <Box className="pokemon-card__stats">
            <Typography variant="body2">
              Altura:{" "}
              {pokemon.height ? (pokemon.height / 10).toFixed(1) : "N/A"}m
            </Typography>
            <Typography variant="body2">
              Peso: {pokemon.weight ? (pokemon.weight / 10).toFixed(1) : "N/A"}
              kg
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ position: "absolute", top: 8, right: 8 }}>
        <IconButton
          sx={{
            bgcolor: "background.paper",
            "&:hover": {
              bgcolor: "background.paper",
            },
          }}
          onClick={onFavoriteClick}
        >
          <Tooltip
            title={
              isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
            }
          >
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </Tooltip>
        </IconButton>
      </Box>
    </Card>
  );
};
