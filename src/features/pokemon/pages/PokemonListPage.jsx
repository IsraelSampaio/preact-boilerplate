import { Container, Typography, Box } from "@mui/material";
import { MainLayout } from "@/components/layout/index.js";
import { PokemonFilters } from "../components/PokemonFilters.jsx";
import { PokemonList } from "../components/PokemonList.jsx";
import { usePokemon } from "../hooks/usePokemon.js";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";

export const PokemonListPage = () => {
  const { t } = useTranslation();
  const {
    pokemonList,
    filters,
    isLoading,
    error,
    updateFilters,
    applyCurrentFilters,
    applyFilters,
  } = usePokemon();

  const handleFiltersChange = (newFilters) => {
    updateFilters(newFilters);
  };

  const handleApplyFilters = (filtersToApply) => {
    if (filtersToApply) {
      // Aplica os filtros passados diretamente
      applyFilters(filtersToApply);
    } else {
      // Fallback para os filtros atuais do store
      applyCurrentFilters();
    }
  };

  return (
    <MainLayout title={t("navigation.pokemon")}>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {t("pokemon.list.title")}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t("pokemon.list.subtitle")}
          </Typography>
        </Box>

        <PokemonFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onApplyFilters={handleApplyFilters}
        />

        <PokemonList
          pokemonList={pokemonList}
          isLoading={isLoading}
          error={error}
        />
      </Container>
    </MainLayout>
  );
};
