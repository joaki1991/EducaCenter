import { useState } from 'react';
import { Typography, Button, Box } from '@mui/material';
import { logoutUser } from '../api/logout';

export default function Home({ onLogout }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError('');
    
    try {
      const response = await logoutUser();
      
      if (response.success) {
        onLogout(); // Llama a la función del componente App para redirigir al login
      } else {
        setError(response.message || 'Error al cerrar sesión');
        setIsLoggingOut(false);
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      setIsLoggingOut(false);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Bienvenido a EducaCenter
      </Typography>
      <Typography variant="body1" gutterBottom>
        Has iniciado sesión correctamente.
      </Typography>
      {error && (
        <Typography variant="body2" color="error" gutterBottom>
          {error}
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar sesión'}
      </Button>
    </Box>
  );
}