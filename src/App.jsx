import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './components/theme';
import Login from './views/Login';
import Home from './views/Home';
import ProtectedRoute from './components/ProtectedRoute';
import { logoutUser } from './api/logout';

// Este componente se encargará de gestionar las rutas de la aplicación.
// Si la ruta es /, se cargará el componente Login, que es la página de login de la aplicación teniendo en cuenta que el usuario no ha iniciado sesión.
// Para acceder al resto de rutas, el usuario debe iniciar sesión, ya que son rutas protegidas.
function App() {
  // Estado para gestionar la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const token = localStorage.getItem('EducaCenterToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // Función para manejar el inicio de sesión exitoso
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await logoutUser(); // Llama al backend para cerrar sesión
    } catch (error) {
      console.error('Error cerrando sesión en backend:', error);
    } finally {
      localStorage.removeItem('EducaCenterToken');
      setIsAuthenticated(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
    <CssBaseline /> {/* Normaliza estilos por defecto */}
      <BrowserRouter>
        <Routes>
          {/* Ruta de Login - redirige a Home si ya está autenticado */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
                <Navigate to="/" /> : 
                <Login onLogin={handleLogin} />
            } 
          />

          {/* Rutas protegidas */}
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home onLogout={handleLogout} />
              </ProtectedRoute>
            }
          />
          
          {/* Redirigir cualquier otra ruta a la página principal o login según autenticación */}
          <Route 
            path="*" 
            element={<Navigate to={isAuthenticated ? "/" : "/login"} />} 
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
