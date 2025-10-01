import { useState, useEffect, useCallback } from "preact/hooks";
import { route } from "preact-router";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Paper,
  Divider,
} from "@mui/material";
import {
  ArrowBack,
  Favorite,
  FavoriteBorder,
  Compare,
  Share,
} from "@mui/icons-material";
import { MainLayout } from "@/components/layout/index.js";
import { PokemonApiService } from "../services/pokemonApi.js";
import {
  useAppDispatch,
  useAppSelector,
} from "@features/shared/hooks/useAppDispatch.js";
import { useFavorites } from "../hooks/useFavorites.js";
import { useComparison } from "../hooks/useComparison.js";
import {
  setSelectedPokemon,
  setLoading,
  setError,
} from "../store/pokemonSlice.js";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";

/**
 * Componente PokemonDetailsPage
 * Página de detalhes completos de um Pokémon específico
 */
export const PokemonDetailsPage = ({ id }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {
    selected: pokemon,
    isLoading,
    error,
  } = useAppSelector((state) => state.pokemon);
  const { togglePokemonFavorite, isFavorite } = useFavorites();
  const {
    togglePokemonComparison,
    isInComparison,
    comparisonCount,
    canAddToComparison,
  } = useComparison();
  const [activeTab, setActiveTab] = useState(0);

  const loadPokemonDetails = useCallback(
    async (pokemonId) => {
      try {
        dispatch(setLoading(true));
        dispatch(setError(null));
        const pokemonData = await PokemonApiService.getPokemonById(pokemonId);
        dispatch(setSelectedPokemon(pokemonData.toInternal()));
      } catch (err) {
        dispatch(setError(err.message || "Erro ao carregar Pokémon"));
      } finally {
        dispatch(setLoading(false));
      }
    },
    [dispatch],
  );

  useEffect(() => {
    if (id) {
      loadPokemonDetails(id);
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleBack = () => {
    route("/pokemon");
  };

  const handleFavorite = () => {
    if (pokemon) {
      togglePokemonFavorite(pokemon);
    }
  };

  const pokemonIsFavorite = pokemon ? isFavorite(pokemon.id) : false;
  const pokemonIsInComparison = pokemon ? isInComparison(pokemon.id) : false;

  const handleComparison = () => {
    if (pokemon) {
      const result = togglePokemonComparison(pokemon);
      if (result === "error") {
        alert(t("comparison.actions.maxReached", { max: 4 }));
      }
    }
  };

  const handleViewComparison = () => {
    route("/comparison");
  };

  const handleShare = () => {
    if (navigator.share && pokemon) {
      navigator.share({
        title: `Pokémon ${pokemon.name}`,
        text: `Confira os detalhes do ${pokemon.name} no Pokémon App!`,
        url: window.location.href,
      });
    }
  };

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

  const getStatColor = (value) => {
    if (value >= 100) return "#4CAF50"; // Verde
    if (value >= 70) return "#FF9800"; // Laranja
    return "#F44336"; // Vermelho
  };

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout title={t("details.loading")}>
        <Container maxWidth="lg">
          <Box sx={{ width: "100%", mt: 4 }}>
            <LinearProgress />
            <Typography variant="h6" align="center" sx={{ mt: 2 }}>
              {t("details.loadingDetails")}
            </Typography>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout title={t("details.error")}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {t("details.errorLoading")}
            </Typography>
            <Typography variant="body1" paragraph>
              {error}
            </Typography>
            <Button variant="contained" onClick={handleBack}>
              {t("details.backToList")}
            </Button>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  if (!pokemon) {
    return (
      <MainLayout title={t("details.notFound")}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="h5" gutterBottom>
              {t("details.notFound")}
            </Typography>
            <Button variant="contained" onClick={handleBack}>
              {t("details.backToList")}
            </Button>
          </Box>
        </Container>
      </MainLayout>
    );
  }

  return (
    <MainLayout title={pokemon.name}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3, mt: 2 }}>
          <IconButton onClick={handleBack} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
          </Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Tooltip
              title={
                pokemonIsFavorite
                  ? t("details.favorite.remove")
                  : t("details.favorite.add")
              }
            >
              <IconButton onClick={handleFavorite}>
                {pokemonIsFavorite ? (
                  <Favorite color="error" />
                ) : (
                  <FavoriteBorder />
                )}
              </IconButton>
            </Tooltip>
            <Tooltip
              title={
                pokemonIsInComparison
                  ? t("details.comparison.remove")
                  : t("details.comparison.add")
              }
            >
              <IconButton
                onClick={handleComparison}
                color={pokemonIsInComparison ? "primary" : "default"}
              >
                <Compare />
              </IconButton>
            </Tooltip>
            {comparisonCount > 0 && (
              <Tooltip
                title={t("details.comparison.view", { count: comparisonCount })}
              >
                <IconButton onClick={handleViewComparison} color="secondary">
                  <Compare />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {comparisonCount}
                  </Typography>
                </IconButton>
              </Tooltip>
            )}
            <Tooltip title={t("details.share")}>
              <IconButton onClick={handleShare}>
                <Share />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Informações principais */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card sx={{ textAlign: "center", p: 2 }}>
              <Avatar
                src={
                  pokemon.sprites?.front_default || "/placeholder-pokemon.png"
                }
                alt={pokemon.name}
                sx={{ width: 200, height: 200, margin: "0 auto", mb: 2 }}
              />
              <Typography variant="h6" gutterBottom>
                #{pokemon.id.toString().padStart(3, "0")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 1,
                  mb: 2,
                }}
              >
                {pokemon.types.map((type) => (
                  <Chip
                    key={type.slot}
                    label={
                      type.type.name.charAt(0).toUpperCase() +
                      type.type.name.slice(1)
                    }
                    sx={{
                      backgroundColor: getTypeColor(type.type.name),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                ))}
              </Box>
              <Divider sx={{ my: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("pokemon.details.height")}
                  </Typography>
                  <Typography variant="h6">
                    {pokemon.heightInMeters}m
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    {t("pokemon.details.weight")}
                  </Typography>
                  <Typography variant="h6">{pokemon.weightInKg}kg</Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper>
              <Tabs
                value={activeTab}
                onChange={(e, newValue) => setActiveTab(newValue)}
              >
                <Tab label={t("details.tabs.stats")} />
                <Tab label={t("details.tabs.abilities")} />
                <Tab label={t("details.tabs.images")} />
              </Tabs>

              {/* Tab Estatísticas */}
              <TabPanel value={activeTab} index={0}>
                <Typography variant="h6" gutterBottom>
                  {t("details.stats.title")}
                </Typography>
                {pokemon.stats.map((stat) => (
                  <Box key={stat.stat.name} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "capitalize" }}
                      >
                        {stat.stat.name.replace("-", " ")}
                      </Typography>
                      <Typography variant="body2" fontWeight="bold">
                        {stat.base_stat}
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={(stat.base_stat / 150) * 100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getStatColor(stat.base_stat),
                        },
                      }}
                    />
                  </Box>
                ))}
                <Box sx={{ mt: 3, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("details.stats.baseExperience")}:{" "}
                    {pokemon.base_experience}
                  </Typography>
                </Box>
              </TabPanel>

              {/* Tab Habilidades */}
              <TabPanel value={activeTab} index={1}>
                <Typography variant="h6" gutterBottom>
                  {t("details.abilities.title")}
                </Typography>
                <Grid container spacing={2}>
                  {pokemon.abilities.map((ability) => (
                    <Grid item xs={12} sm={6} key={ability.slot}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography
                            variant="h6"
                            sx={{ textTransform: "capitalize" }}
                          >
                            {ability.ability.name.replace("-", " ")}
                          </Typography>
                          {ability.is_hidden && (
                            <Chip
                              label={t("details.abilities.hidden")}
                              size="small"
                              color="secondary"
                              sx={{ mt: 1 }}
                            />
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>

              {/* Tab Imagens */}
              <TabPanel value={activeTab} index={2}>
                <Typography variant="h6" gutterBottom>
                  {t("details.sprites.title")}
                </Typography>
                <Grid container spacing={2}>
                  {pokemon.sprites?.front_default && (
                    <Grid item xs={6} sm={3}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <img
                            src={pokemon.sprites.front_default}
                            alt="Frente padrão"
                            style={{ width: "100%", maxWidth: 150 }}
                          />
                          <Typography variant="caption" display="block">
                            {t("details.sprites.frontDefault")}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {pokemon.sprites?.back_default && (
                    <Grid item xs={6} sm={3}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <img
                            src={pokemon.sprites.back_default}
                            alt="Costas padrão"
                            style={{ width: "100%", maxWidth: 150 }}
                          />
                          <Typography variant="caption" display="block">
                            {t("details.sprites.backDefault")}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {pokemon.sprites?.front_shiny && (
                    <Grid item xs={6} sm={3}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <img
                            src={pokemon.sprites.front_shiny}
                            alt="Frente shiny"
                            style={{ width: "100%", maxWidth: 150 }}
                          />
                          <Typography variant="caption" display="block">
                            {t("details.sprites.frontShiny")}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                  {pokemon.sprites?.back_shiny && (
                    <Grid item xs={6} sm={3}>
                      <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                          <img
                            src={pokemon.sprites.back_shiny}
                            alt="Costas shiny"
                            style={{ width: "100%", maxWidth: 150 }}
                          />
                          <Typography variant="caption" display="block">
                            {t("details.sprites.backShiny")}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  )}
                </Grid>
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </MainLayout>
  );
};
