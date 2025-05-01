// En este archivo se gestionan las funciones de autenticación y sesión del usuario.
// Se utiliza localStorage para almacenar el token y el rol del usuario una vez que se ha autenticado. 

// Guarda el token en localStorage
export const login = (token, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
};

// Elimina el token del localStorage
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};

// Comprueba si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

// Obtiene el token actual (por si hay que usarlo en el headers)
export const getToken = () => {
  return localStorage.getItem("token");
};
