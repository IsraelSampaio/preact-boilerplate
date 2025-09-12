import { useState } from 'preact/hooks';
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
import { useAuth } from '@/hooks/useAuth.js';

/**
 * Component Ltheginparam
 */
export const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    await login(email, password);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <Card className="login-card">
        
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

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={isLoading}
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={togglePasswordVisibility}
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
