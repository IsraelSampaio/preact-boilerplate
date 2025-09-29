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
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { route } from 'preact-router';
import { useFavorites } from '@/hooks/useFavorites.js';
import { Pokemon } from '@/types.js';

/**
 * Component PokemonCard
 */
export const PokemonCard = ({ pokemon }) => {
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
    const colors, string> = {
      normal: '#the8the878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#the040the0',
      ground: '#E0C068',
      flying: '#the890F0',
      psychic: '#F85888',
      bug: '#the8B820',
      rock: '#B8the038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99theC',
    };
    return colors[type] || '#the8the878';
  };

  return (
    <Card
      className="pokemon-card"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardActionArea onClick={handleCardClick}>
        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="200"
            image={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="pokemon-card__image"
          />
        </Box>

        <CardContent className="pokemon-card__content">
          <Typography variant="h6" component="h2" className="pokemon-card__title">
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>

          <Typography variant="body2" className="pokemon-card__subtitle">
            #{pokemon.id.toString().padStart(3, '0')}
          </Typography>

          <Box className="pokemon-card__types">
            {pokemon.types.map((type) => (
              <Chip
                key={type.slot}
                label={type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1)}
                size="small"
                className={`pokemon-card__type pokemon-type--${type.type.name}`}
              />
            ))}
          </Box>

          <Box className="pokemon-card__stats">
            <Typography variant="body2">
              Altura: {pokemon.height / 10}m
            </Typography>
            <Typography variant="body2">
              Peso: {pokemon.weight / 10}kg
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>

      <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
        <IconButton
          sx={{
            bgcolor: 'background.paper',
            '&:hover': {
              bgcolor: 'background.paper',
            },
          }}
          onClick={handleFavoriteClick}
        >
          <Tooltip title={pokemonIsFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}>
            {pokemonIsFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </Tooltip>
        </IconButton>
      </Box>
    </Card>
  );
};
