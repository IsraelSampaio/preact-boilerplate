import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import { Search, Clear, Sort } from '@mui/icons-material';
import { useState, useEffect } from 'preact/hooks';
import { PokemonFiltersDTO } from '../dto/redux/index.js';

/**
 * Component PokemonFilters
 */
export const PokemonFilters = ({ filters, onFiltersChange, onSearch }) => {
  const [localSearch, setLocalSearch] = useState(filters.search);

  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handleSearchSubmit = () => {
    onFiltersChange({ search: localSearch });
    onSearch(localSearch);
  };

  const handleClearFilters = () => {
    setLocalSearch('');
    onFiltersChange({
      search: '',
      type: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });
    onSearch('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const pokemonTypes = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  return (
    <Paper className="pokemon-filters">
      <Typography variant="h6" className="pokemon-filters__title">
        Filtros
      </Typography>
      
      <Grid container spacing={2} alignItems="center" className="pokemon-filters__grid">
        <Grid item xs={12} md={4}>
          <div className="search-input">
            <TextField
              fullWidth
              label="Buscar Pokémon"
              value={localSearch}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-input__field"
              placeholder="Digite o nome do Pokémon..."
            />
            <Search className="search-input__icon" />
          </div>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={filters.type}
              label="Tipo"
              onChange={(e) => onFiltersChange({ type: e.target.value })}
            >
              <MenuItem value="">Todos os tipos</MenuItem>
              {pokemonTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Ordenar por</InputLabel>
            <Select
              value={filters.sortBy}
              label="Ordenar por"
              onChange={(e) => onFiltersChange({ sortBy: e.target.value })}
            >
              <MenuItem value="name">Nome</MenuItem>
              <MenuItem value="id">ID</MenuItem>
              <MenuItem value="height">Altura</MenuItem>
              <MenuItem value="weight">Peso</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>Ordem</InputLabel>
            <Select
              value={filters.sortOrder}
              label="Ordem"
              onChange={(e) => onFiltersChange({ sortOrder: e.target.value })}
            >
              <MenuItem value="asc">Crescente</MenuItem>
              <MenuItem value="desc">Decrescente</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <Box className="pokemon-filters__actions">
            <Button
              variant="contained"
              onClick={handleSearchSubmit}
              startIcon={<Search />}
              className="btn btn--small"
            >
              Buscar
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Clear />}
              className="btn btn--outline btn--small"
            >
              Limpar
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
