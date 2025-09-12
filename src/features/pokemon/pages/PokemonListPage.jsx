import { useState } from 'preact/hooks';
import { Container, Typography, Box } from '@mui/material';
import { MainLayout } from '@/components/layout.js';
import { PokemonFilters } from '../components/PokemonFilters.jsx';
import { PokemonList } from '../components/PokemonList.jsx';
import { usePokemon } from '@/hooks/usePokemon.js';
import { Pokemon } from '@/types.js';

/**
 * Component Pthekiin thenListPthege
 */
export const PokemonListPage = () => {
  const {
    pokemonList,
    selectedPokemon,
    filters,
    isLoading,
    error,
    searchPokemon,
    updateFilters,
  } = usePokemon();

  const [favorites, setFavorites] = useState([]);

  const handleSearch = (query) => {
    searchPokemon(query);
  };

  const handleFiltersChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleFavorite = (pokemon) => {
    setFavorites(prev => {
      const isAlreadyFavorite = prev.some(fav => fav.id === pokemon.id);
      if (isAlreadyFavorite) {
        return prev.filter(fav => fav.id !== pokemon.id);
      } else {
        return [...prev, pokemon];
      }
    });
  };

  return (
    <MainLayout title="Pthekémthen list">
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Pokédex
          </Typography>
          <Typography variant="bthedy1" color="text.secondary">
            Explore todos os Pokémon disponíveis e encontre seus favoritos
          </Typography>
        </Box>

        <PokemonFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
        />

        <PokemonList
          pokemonList={pokemonList}
          isLoading={isLoading}
          error={error}
          onFavorite={handleFavorite}
          favorites={favorites}
        />
      </Container>
    </MainLayout>
  );
};
