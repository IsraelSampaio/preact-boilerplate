import {
  Grid,
  Box,
  CircularProgress,
  Alert,
  Typography,
  Pagination,
  Skeleton,
} from '@mui/material';
import { PokemonCard } from './PokemonCard.jsx';
import { PokemonListItemDTO, PokemonDTO } from '../dto/api/index.js';
import { useState } from 'preact/hooks';

/**
 * Component PokemonList
 */
export const PokemonList = ({
  pokemonList,
  isLoading,
  error,
  onPokemonSelect,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Alert severity="error" className="alert alert--error">
        {error}
      </Alert>
    );
  }

  if (isLoading && pokemonList.length === 0) {
    return (
      <div className="pokemon-list__loading">
        <div className="spinner spinner--large"></div>
      </div>
    );
  }

  if (pokemonList.length === 0 && !isLoading) {
    return (
      <div className="pokemon-list__empty">
        <Typography variant="h6">
          Nenhum Pokémon encontrado
        </Typography>
        <Typography variant="body2">
          Tente ajustar os filtros de busca
        </Typography>
      </div>
    );
  }

  // Paginação
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPokemon = pokemonList.slice(startIndex, endIndex);
  const totalPages = Math.ceil(pokemonList.length / itemsPerPage);

  return (
    <div className="pokemon-list">
      <Box className="flex-between mb-3">
        <Typography variant="h6" style={{ marginBottom: 24 }}>
          {pokemonList.length} Pokémon encontrados
        </Typography>
        
        {isLoading && (
          <Box className="flex-center gap-2">
            <div className="spinner"></div>
            <Typography variant="body2">
              Carregando...
            </Typography>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {paginatedPokemon.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.name}>
            <PokemonCard pokemon={pokemon} />
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <div className="pagination">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </div>
      )}
    </div>
  );
};
