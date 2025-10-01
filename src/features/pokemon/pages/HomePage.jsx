import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { MainLayout } from "@/components/layout/index.js";
import { useTranslation } from "@features/i18n/hooks/useTranslation.js";

/**
 * Component HomePage
 */
export const HomePage = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t("home.features.explore.title"),
      description: t("home.features.explore.description"),
      icon: "🔍",
    },
    {
      title: t("home.features.filter.title"),
      description: t("home.features.filter.description"),
      icon: "⚡",
    },
    {
      title: t("home.features.favorites.title"),
      description: t("home.features.favorites.description"),
      icon: "❤️",
    },
    {
      title: t("home.features.interface.title"),
      description: t("home.features.interface.description"),
      icon: "✨",
    },
  ];

  return (
    <MainLayout title={t("navigation.home")}>
      <Container maxWidth="lg">
        <div className="home-page__hero">
          <Typography variant="h3" component="h1" className="home-page__title">
            {t("home.title")}
          </Typography>
          <Typography variant="h6" className="home-page__subtitle">
            {t("home.subtitle", { name: "Treinador" })}
          </Typography>
        </div>

        <div className="home-page__features">
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card className="feature-card">
                  <CardContent>
                    <Typography variant="h2" className="feature-card__icon">
                      {feature.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      component="h3"
                      className="feature-card__title"
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="feature-card__description"
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>

        <div className="home-page__cta">
          <Typography variant="h5" gutterBottom>
            {t("home.cta.title")}
          </Typography>
          <Typography variant="body1" paragraph>
            {t("home.cta.description")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            href="/pokemon"
            className="btn btn--large"
          >
            {t("home.cta.button")}
          </Button>
        </div>
      </Container>
    </MainLayout>
  );
};
