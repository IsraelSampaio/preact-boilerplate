import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff, Login } from '@mui/icons-material';

/**
 * Componente de apresentação do formulário de login (apenas UI)
 */
export const LoginFormPresentation = ({
  email,
  password,
  showPassword,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onTogglePasswordVisibility,
  onSubmit,
}) => {
  return (
    <div className="login-page">
      <Card className="login-card">
        <CardContent>
          <div className="login-card__header">
            <Typography variant="h4" component="h1" className="login-card__title">
              Pokémon App
            </Typography>
            <Typography variant="body2" className="login-card__subtitle">
              Faça login para acessar sua Pokédex
            </Typography>
          </div>

          {error && (
            <Alert severity="error" className="alert alert--error">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={onSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={onEmailChange}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="email"
              autoFocus
            />
            
            <TextField
              fullWidth
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={onPasswordChange}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={onTogglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading || !email || !password}
              startIcon={isLoading ? <CircularProgress size={20} /> : <Login />}
              className="btn btn--large btn--full-width"
              sx={{ mt: 2, mb: 2 }}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>

            <Box className="login-card__credentials">
              <Typography variant="caption">
                <strong>Credenciais de teste:</strong><br />
                Email: admin@pokemon.com<br />
                Senha: admin123
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};
