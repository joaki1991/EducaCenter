// En este archivo se gestionan las funciones de autenticación y sesión del usuario.
// Se utiliza sessionStorage para almacenar el token y el rol del usuario una vez que se ha autenticado. 

// Guarda el token en sessionStorage
export const login = (token, role) => {
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("role", role);
};

// Elimina el token del sessionStorage
export const logout = () => {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("role");
};

// Comprueba si el usuario está autenticado
export const isAuthenticated = () => {
  return sessionStorage.getItem("token") !== null;
};

// Obtiene el token actual (por si hay que usarlo en el headers)
export const getToken = () => {
  return sessionStorage.getItem("token");
};
