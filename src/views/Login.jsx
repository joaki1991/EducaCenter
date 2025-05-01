import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, CircularProgress, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { loginUser } from '../api/login';
import backgroundImage from '../assets/background_login.png';
import logo from '../assets/logo.png';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(email, password);
      
      if (response.success) {        
        onLogin(); // Llama al cambio de vista que se pasa como prop en el componente
      } else {
        setError(response.message || 'Credenciales inválidas');
      }
    } catch (err) {
      console.error('Error al iniciar sesión:', err);
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        position: 'fixed',
        top: 0,
        left: 0,
        margin: 0,
        padding: 0,
        overflow: 'hidden'
      }}
    >
      {/* Sección izquierda con la imagen */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          flex: { xs: '0', md: '1' }, // En móviles oculta la imagen, en pc ocupa 50%
          display: { xs: 'none', md: 'block' }, // Oculta en móviles
          overflow: 'hidden',
          height: '100%',
        }}
      >
        <img
          src={backgroundImage}
          alt="EducaCenter"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Sección derecha con el login */}
      <Box
        component={motion.div}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          flex: '1',
          flexDirection: 'column',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#e3f2fd',
          p: 3,
        }}
      >
        <Box display="flex" justifyContent="center" mb={3}>
            <img
              src={logo}
              alt="Logo"
              style={{ width: 'auto', height: 100 }}
            />
        </Box>
        <Paper
          elevation={6}
          component={motion.div}         
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 400,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            transition: 'opacity 0.3s ease-in-out',
          }}
        >          
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Inicio de Sesión
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Typography color="error" mt={1}>
                {error}
              </Typography>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}