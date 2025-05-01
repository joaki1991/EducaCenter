import api from "./axios";
import { login } from "./auth";


// Voy a crear una funcion para hacer login
// La función se llamará loginUser y recibirá un email y una contraseña, con la cual podré obtener el token de la API

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login.php", { email, password });
    const data = response.data;

    if (data.token) {
      login(data.token, data.role, data.name, data.surname); // Si hay respuesta por parte del servidor, guarda el token y el rol en localStorage
      return { success: true };
    } else {
      return { success: false, message: data.message || "Credenciales incorrectas" };
    }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "Error al conectar con el servidor",
    };
  }
};