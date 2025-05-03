import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './components/theme';
import ProtectedRoute from './components/ProtectedRoute';
import { logoutUser } from './api/logout';
import Login from './views/Login';
import Home from './views/Home';
import User from './views/User';
import Messages from './views/Messages';
import Absences from './views/Absences';
import Reports from './views/Reports';
import News from './views/News';
import UsersAdmin from './views/UsersAdmin';
import GroupsAdmin from './views/GroupsAdmin';

// Este componente se encargará de gestionar las rutas de la aplicación.
// Si la ruta es /, se cargará el componente Login, que es la página de login de la aplicación teniendo en cuenta que el usuario no ha iniciado sesión.
// Para acceder al resto de rutas, el usuario debe iniciar sesión, ya que son rutas protegidas.
function App() {
  // Estado para gestionar la autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // En la siguiente constante se define el tiempo de expiración del token en horas.
  const hours = 2;
  // Verificar si el token ha expirado al cargar la aplicación 
  // Si ha transcurrido más de 2 horas desde el inicio de sesión, se eliminará el token y se recargará la página.
  useEffect(() => {
    const loginTime = localStorage.getItem("EducaCenterLoginTime");
    const expirationTime = 60*hours * 60 * 1000;
  
    if (loginTime && Date.now() - parseInt(loginTime, 10) > expirationTime) {
      localStorage.clear();
      window.location.reload(); // Opcional: forzar recarga
    }
  }, []);

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
          
          <Route
            path="/usuario"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>                
                <User onLogout={handleLogout} />                
              </ProtectedRoute>
            }
          />

          <Route
            path="/mensajes"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>                
                <Messages onLogout={handleLogout} />                
              </ProtectedRoute>
            }
          />

          <Route
            path="/faltas"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>               
                <Absences onLogout={handleLogout} />                
              </ProtectedRoute>
            }
          />

          <Route
            path="/informes"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>                
                <Reports onLogout={handleLogout} />                
              </ProtectedRoute>
            }
          />

          <Route
            path="/noticias"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>                
                <News onLogout={handleLogout} />                
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/usuarios"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>                
                <UsersAdmin onLogout={handleLogout} />                
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/grupos"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>                
                <GroupsAdmin onLogout={handleLogout} />                
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
