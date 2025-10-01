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
} from "@mui/material";
import { Search, Clear } from "@mui/icons-material";
import { useState, useEffect } from "preact/hooks";
import { PokemonFiltersDTO } from "../dto/redux/index.js";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";

export const PokemonFilters = ({
  filters,
  onFiltersChange,
  onApplyFilters,
}) => {
  const { t } = useTranslation();
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [localType, setLocalType] = useState(filters.type);
  const [localSortBy, setLocalSortBy] = useState(filters.sortBy);
  const [localSortOrder, setLocalSortOrder] = useState(filters.sortOrder);

  useEffect(() => {
    setLocalSearch(filters.search);
    setLocalType(filters.type);
    setLocalSortBy(filters.sortBy);
    setLocalSortOrder(filters.sortOrder);
  }, [filters.search, filters.type, filters.sortBy, filters.sortOrder]);

  const handleSearchChange = (event) => {
    setLocalSearch(event.target.value);
  };

  const handleTypeChange = (event) => {
    setLocalType(event.target.value);
  };

  const handleSortByChange = (event) => {
    setLocalSortBy(event.target.value);
  };

  const handleSortOrderChange = (event) => {
    setLocalSortOrder(event.target.value);
  };

  const handleSearchSubmit = () => {
    const newFilters = {
      search: localSearch,
      type: localType,
      sortBy: localSortBy,
      sortOrder: localSortOrder,
    };
    onFiltersChange(newFilters);
    onApplyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setLocalSearch("");
    setLocalType("");
    setLocalSortBy("id");
    setLocalSortOrder("asc");

    const clearedFilters = {
      search: "",
      type: "",
      sortBy: "id",
      sortOrder: "asc",
    };
    onFiltersChange(clearedFilters);
    onApplyFilters(clearedFilters);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  // Verificar se há conflito de filtros
  const hasFilterConflict = localSearch && localType;

  return (
    <Paper className="pokemon-filters">
      <Typography variant="h6" className="pokemon-filters__title">
        {t("filters.title")}
      </Typography>

      {hasFilterConflict && (
        <Box sx={{ mb: 2, p: 1, bgcolor: "warning.light", borderRadius: 1 }}>
          <Typography variant="body2" color="warning.contrastText">
            {t("filters.conflict")}
          </Typography>
        </Box>
      )}

      <Grid
        container
        spacing={2}
        alignItems="center"
        className="pokemon-filters__grid"
      >
        <Grid item xs={12} md={4}>
          <div className="search-input">
            <TextField
              fullWidth
              label={t("filters.search.label")}
              value={localSearch}
              onChange={handleSearchChange}
              onKeyPress={handleKeyPress}
              className="search-input__field"
              placeholder={t("filters.search.placeholder")}
            />
            <Search className="search-input__icon" />
          </div>
        </Grid>

        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>{t("filters.type.label")}</InputLabel>
            <Select
              value={localType}
              label={t("filters.type.label")}
              onChange={handleTypeChange}
            >
              <MenuItem value="">{t("filters.type.all")}</MenuItem>
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
            <InputLabel>{t("filters.sort.label")}</InputLabel>
            <Select
              value={localSortBy}
              label={t("filters.sort.label")}
              onChange={handleSortByChange}
            >
              <MenuItem value="name">{t("filters.sort.name")}</MenuItem>
              <MenuItem value="id">{t("filters.sort.id")}</MenuItem>
              <MenuItem value="height">{t("filters.sort.height")}</MenuItem>
              <MenuItem value="weight">{t("filters.sort.weight")}</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={2}>
          <FormControl fullWidth>
            <InputLabel>{t("filters.sort.order")}</InputLabel>
            <Select
              value={localSortOrder}
              label={t("filters.sort.order")}
              onChange={handleSortOrderChange}
            >
              <MenuItem value="asc">{t("filters.sort.asc")}</MenuItem>
              <MenuItem value="desc">{t("filters.sort.desc")}</MenuItem>
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
              {t("filters.search.button")}
            </Button>
            <Button
              variant="outlined"
              onClick={handleClearFilters}
              startIcon={<Clear />}
              className="btn btn--outline btn--small"
            >
              {t("filters.actions.clear")}
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};
