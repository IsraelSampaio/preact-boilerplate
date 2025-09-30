import { useState } from 'preact/hooks';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  InputBase,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Search,
  Clear,
  Delete,
  Sort,
} from '@mui/icons-material';
import { MainLayout } from '@/components/layout/index.js';
import { PokemonCard } from '../components/PokemonCard.jsx';
import { useFavorites } from '../hooks/useFavorites.js';

/**
 * Componente FavoritesPage
 * Página que exibe todos os Pokémon favoritos do usuário
 */
export const FavoritesPage = () => {
  const {
    favorites,
    favoritesCount,
    clearAllFavorites,
    searchFavorites,
    sortFavorites,
  } = useFavorites();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Aplica filtros e ordenação
  const filteredFavorites = searchFavorites(searchQuery);
  const sortedFavorites = sortFavorites(sortBy, sortOrder).filter(pokemon =>
    pokemon.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleClearAllFavorites = () => {
    clearAllFavorites();
    setClearDialogOpen(false);
  };

  const handleOpenClearDialog = () => {
    setClearDialogOpen(true);
  };

  const handleCloseClearDialog = () => {
    setClearDialogOpen(false);
  };

  return (
    <MainLayout title="Favoritos">
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Meus Pokémon Favoritos
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {favoritesCount === 0
              ? 'Você ainda não tem nenhum Pokémon favorito.'
              : `Você tem ${favoritesCount} Pokémon ${favoritesCount === 1 ? 'favorito' : 'favoritos'}.`
            }
          </Typography>
        </Box>

        {favoritesCount > 0 && (
          <>
            {/* Controles de busca e filtros */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                {/* Busca */}
                <Grid item xs={12} md={6}>
                  <Paper
                    component="form"
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      p: '2px 4px',
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <IconButton sx={{ p: '10px' }} aria-label="search">
                      <Search />
                    </IconButton>
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Buscar nos favoritos..."
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                    {searchQuery && (
                      <IconButton sx={{ p: '10px' }} onClick={handleClearSearch}>
                        <Clear />
                      </IconButton>
                    )}
                  </Paper>
                </Grid>

                {/* Ordenação */}
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Ordenar por</InputLabel>
                    <Select
                      value={sortBy}
                      label="Ordenar por"
                      onChange={(e) => setSortBy(e.target.value)}
                    >
                      <MenuItem value="name">Nome</MenuItem>
                      <MenuItem value="id">Número</MenuItem>
                      <MenuItem value="type">Tipo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={2}>
                  <Button
                    variant="outlined"
                    startIcon={<Sort />}
                    onClick={() => handleSortChange(sortBy)}
                    fullWidth
                  >
                    {sortOrder === 'asc' ? 'A-Z' : 'Z-A'}
                  </Button>
                </Grid>

                {/* Limpar todos */}
                <Grid item xs={12} md={1}>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Delete />}
                    onClick={handleOpenClearDialog}
                    fullWidth
                  >
                    Limpar
                  </Button>
                </Grid>
              </Grid>
            </Paper>

            {/* Lista de favoritos */}
            {sortedFavorites.length === 0 ? (
              <Alert severity="info" sx={{ mt: 2 }}>
                Nenhum favorito encontrado com os filtros aplicados.
              </Alert>
            ) : (
              <Grid container spacing={3}>
                {sortedFavorites.map((pokemon) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                    <PokemonCard pokemon={pokemon} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}

        {favoritesCount === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h6" gutterBottom>
              🤔 Nenhum favorito ainda
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Explore a Pokédex e adicione seus Pokémon favoritos clicando no ícone de coração!
            </Typography>
            <Button variant="contained" href="/pokemon">
              Explorar Pokémon
            </Button>
          </Box>
        )}

        {/* Dialog de confirmação para limpar todos os favoritos */}
        <Dialog
          open={clearDialogOpen}
          onClose={handleCloseClearDialog}
          aria-labelledby="clear-favorites-dialog-title"
        >
          <DialogTitle id="clear-favorites-dialog-title">
            Limpar todos os favoritos?
          </DialogTitle>
          <DialogContent>
            <Typography>
              Esta ação removerá todos os {favoritesCount} Pokémon dos seus favoritos.
              Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseClearDialog}>Cancelar</Button>
            <Button
              onClick={handleClearAllFavorites}
              color="error"
              variant="contained"
              autoFocus
            >
              Sim, limpar todos
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};
