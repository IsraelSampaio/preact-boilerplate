import { useState } from 'preact/hooks';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Avatar,
  Divider,
  Alert,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
} from '@mui/material';
import {
  Delete,
  Clear,
  ArrowBack,
  SwapHoriz,
  TrendingUp,
  TrendingDown,
  BarChart,
} from '@mui/icons-material';
import { route } from 'preact-router';
import { MainLayout } from '@/components/layout/index.js';
import { useComparison } from '../hooks/useComparison.js';

/**
 * Componente ComparisonPage
 * Página para comparar múltiplos Pokémon lado a lado
 */
export const ComparisonPage = () => {
  const {
    comparisonList,
    comparisonCount,
    removePokemonFromComparison,
    clearAllComparison,
    getComparisonStats,
  } = useComparison();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState('stats');

  const stats = getComparisonStats();

  const handleBack = () => {
    route('/pokemon');
  };

  const handleRemovePokemon = (pokemonId) => {
    removePokemonFromComparison(pokemonId);
  };

  const handleClearAll = () => {
    clearAllComparison();
    setClearDialogOpen(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      normal: '#A8A878',
      fire: '#F08030',
      water: '#6890F0',
      electric: '#F8D030',
      grass: '#78C850',
      ice: '#98D8D8',
      fighting: '#C03028',
      poison: '#A040A0',
      ground: '#E0C068',
      flying: '#A890F0',
      psychic: '#F85888',
      bug: '#A8B820',
      rock: '#B8A038',
      ghost: '#705898',
      dragon: '#7038F8',
      dark: '#705848',
      steel: '#B8B8D0',
      fairy: '#EE99AC',
    };
    return colors[type] || '#A8A878';
  };

  const getStatDisplayName = (statName) => {
    const names = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defesa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defesa Especial',
      speed: 'Velocidade',
    };
    return names[statName] || statName;
  };

  if (comparisonCount === 0) {
    return (
      <MainLayout title="Comparação">
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography variant="h4" gutterBottom>
              🔍 Nenhum Pokémon para comparar
            </Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              Adicione Pokémon à comparação clicando no ícone de comparação nas páginas de detalhes.
            </Typography>
            <Button variant="contained" onClick={handleBack}>
              Explorar Pokémon
            </Button>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title="Comparação de Pokémon">
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, mt: 2 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            Comparação de Pokémon ({comparisonCount})
          </Typography>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Clear />}
            onClick={() => setClearDialogOpen(true)}
          >
            Limpar Todos
          </Button>
        </Box>

        {/* Cards dos Pokémon */}
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {comparisonList.map((pokemon) => (
            <Grid item xs={12} sm={6} md={3} key={pokemon.id}>
              <Card>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={pokemon.sprites?.front_default || '/placeholder-pokemon.png'}
                    alt={pokemon.name}
                    sx={{ width: 100, height: 100, margin: '16px auto', display: 'block' }}
                  />
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                    onClick={() => handleRemovePokemon(pokemon.id)}
                  >
                    <Delete />
                  </IconButton>
                </Box>
                <CardContent sx={{ textAlign: 'center', pt: 0 }}>
                  <Typography variant="h6" gutterBottom>
                    {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    #{pokemon.id.toString().padStart(3, '0')}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, mb: 1 }}>
                    {pokemon.types.map((type) => (
                      <Chip
                        key={type.slot}
                        label={type.type.name}
                        size="small"
                        sx={{
                          backgroundColor: getTypeColor(type.type.name),
                          color: 'white',
                          fontSize: '0.7rem',
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Estatísticas Resumidas */}
        {stats && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              📊 Resumo da Comparação
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Altura Média
                </Typography>
                <Typography variant="h6">{stats.averageHeight}m</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Peso Médio
                </Typography>
                <Typography variant="h6">{stats.averageWeight}kg</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Exp. Base Média
                </Typography>
                <Typography variant="h6">{stats.averageBaseExperience}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="text.secondary">
                  Tipo Mais Comum
                </Typography>
                <Chip
                  label={stats.mostCommonType}
                  size="small"
                  sx={{
                    backgroundColor: getTypeColor(stats.mostCommonType),
                    color: 'white',
                  }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 2 }} />

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUp color="success" />
                  <Typography variant="body2">
                    <strong>Maior Stat:</strong> {getStatDisplayName(stats.highestStat.name)} ({stats.highestStat.value}) - {stats.highestStat.pokemon}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDown color="error" />
                  <Typography variant="body2">
                    <strong>Menor Stat:</strong> {getStatDisplayName(stats.lowestStat.name)} ({stats.lowestStat.value}) - {stats.lowestStat.pokemon}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Tabela de Comparação Detalhada */}
        <Paper>
          <Typography variant="h6" sx={{ p: 3, pb: 1 }}>
            📋 Comparação Detalhada
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Atributo</strong></TableCell>
                  {comparisonList.map((pokemon) => (
                    <TableCell key={pokemon.id} align="center">
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar
                          src={pokemon.sprites?.front_default || '/placeholder-pokemon.png'}
                          alt={pokemon.name}
                          sx={{ width: 40, height: 40, mb: 1 }}
                        />
                        <Typography variant="caption">
                          {pokemon.name}
                        </Typography>
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Informações Básicas */}
                <TableRow>
                  <TableCell><strong>Altura</strong></TableCell>
                  {comparisonList.map((pokemon) => (
                    <TableCell key={pokemon.id} align="center">
                      {(pokemon.height / 10).toFixed(1)}m
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell><strong>Peso</strong></TableCell>
                  {comparisonList.map((pokemon) => (
                    <TableCell key={pokemon.id} align="center">
                      {(pokemon.weight / 10).toFixed(1)}kg
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell><strong>Experiência Base</strong></TableCell>
                  {comparisonList.map((pokemon) => (
                    <TableCell key={pokemon.id} align="center">
                      {pokemon.base_experience}
                    </TableCell>
                  ))}
                </TableRow>

                {/* Estatísticas */}
                {['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((statName) => (
                  <TableRow key={statName}>
                    <TableCell><strong>{getStatDisplayName(statName)}</strong></TableCell>
                    {comparisonList.map((pokemon) => {
                      const stat = pokemon.stats?.find(s => s.stat.name === statName);
                      const value = stat?.base_stat || 0;
                      const maxValue = Math.max(...comparisonList.map(p => 
                        p.stats?.find(s => s.stat.name === statName)?.base_stat || 0
                      ));
                      const isHighest = value === maxValue && value > 0;
                      
                      return (
                        <TableCell key={pokemon.id} align="center">
                          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: isHighest ? 'bold' : 'normal',
                                color: isHighest ? 'success.main' : 'inherit'
                              }}
                            >
                              {value}
                            </Typography>
                            <LinearProgress
                              variant="determinate"
                              value={(value / 150) * 100}
                              sx={{ 
                                width: 60, 
                                mt: 0.5,
                                '& .MuiLinearProgress-bar': {
                                  backgroundColor: isHighest ? 'success.main' : 'primary.main'
                                }
                              }}
                            />
                          </Box>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Dialog de confirmação */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
        >
          <DialogTitle>Limpar toda a comparação?</DialogTitle>
          <DialogContent>
            <Typography>
              Esta ação removerá todos os {comparisonCount} Pokémon da comparação.
              Esta ação não pode ser desfeita.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleClearAll} color="error" variant="contained">
              Sim, limpar todos
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};
