import api from "./axios";
import { logout } from "./auth";

export const logoutUser = async () => {
    try {
      const response = await api.post("/logout.php");
      const data = response.data;
  
      if (data.success) {
        logout(); // Si hay respuesta  de éxito por parte del servidor, borramos el token y el rol en sessionStorage
        return { success: true };
      } else {
        return { success: false, message: data.message || "Error al cerrar sesión" };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Error al conectar con el servidor",
      };
    }
  };