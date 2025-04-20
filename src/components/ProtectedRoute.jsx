import { Navigate } from 'react-router-dom';
import { isAuthenticated } from "../api/auth";

// Este componente se encargará de comprobar si hay un token
// (guardado, en sessionStorage) y redirigir al login si no existe.
const ProtectedRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
};
  
export default ProtectedRoute;