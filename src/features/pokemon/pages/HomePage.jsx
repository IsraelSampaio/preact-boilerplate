import { Container, Typography, Box, Grid, Card, CardContent, Button } from '@mui/material';
import { MainLayout } from '@/components/layout/index.js';

/**
 * Component HomePage
 */
export const HomePage = () => {

  const features = [
    {
      title: 'Explorar Pokémon',
      description: 'Descubra informações detalhadas sobre cada Pokémon da Pokédex',
      icon: '🔍',
    },
    {
      title: 'Filtros Avançados',
      description: 'Encontre Pokémon por tipo, nome e outras características',
      icon: '⚡',
    },
    {
      title: 'Favoritos',
      description: 'Salve seus Pokémon favoritos para acesso rápido',
      icon: '❤️',
    },
    {
      title: 'Interface Moderna',
      description: 'Desfrute de uma experiência visual moderna e responsiva',
      icon: '✨',
    },
  ];

  return (
    <MainLayout title="Início">
      <Container maxWidth="lg">
        <div className="home-page__hero">
          <Typography variant="h3" component="h1" className="home-page__title">
            Bem-vindo ao Pokémon App! 🎮
          </Typography>
          <Typography variant="h6" className="home-page__subtitle">
            Explore o mundo dos Pokémon com nossa aplicação moderna.
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
                    <Typography variant="h6" component="h3" className="feature-card__title">
                      {feature.title}
                    </Typography>
                    <Typography variant="body2" className="feature-card__description">
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
            Pronto para começar?
          </Typography>
          <Typography variant="body1" paragraph>
            Navegue para a seção de Pokémon e comece sua jornada pela Pokédex!
          </Typography>
          <Button variant="contained" size="large" href="/pokemon" className="btn btn--large">
            Explorar Pokémon
          </Button>
        </div>
      </Container>
    </MainLayout>
  );
};