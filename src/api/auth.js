// En este archivo se gestionan las funciones de autenticación y sesión del usuario.
// Se utiliza localStorage para almacenar el token y el rol del usuario una vez que se ha autenticado. 

// Guarda el token en localStorage
export const login = (token, role, name, surname, id) => {
  localStorage.setItem("EducaCenterToken", token);
  localStorage.setItem("EducaCenterRole", role);
  localStorage.setItem("EducaCenterUser", [name || "Usuario", surname || ""].join(" ").trim());
  localStorage.setItem("EducaCenterId", id);
  localStorage.setItem("EducaCenterLoginTime", Date.now().toString()); 
};

// Elimina el token del localStorage
export const logout = () => {
  localStorage.removeItem("EducaCenterToken");
  localStorage.removeItem("EducaCenterRole");
  localStorage.removeItem("EducaCenterUser");
  localStorage.removeItem("EducaCenterLoginTime");
  localStorage.removeItem("EducaCenterId");
};

// Comprueba si el usuario está autenticado
export const isAuthenticated = () => {
  return localStorage.getItem("EducaCenterToken") !== null;
};

// Obtiene el token actual (por si hay que usarlo en el headers)
export const getToken = () => {
  return localStorage.getItem("EducaCenterToken");
};
