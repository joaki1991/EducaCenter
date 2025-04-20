import axios from "axios";
import API_BASE from "./config";

// Voy a crear un archivo de configuración para realizar las peticiones a la API con axios
// Crear una instancia de Axios
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token automáticamente si existe
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;