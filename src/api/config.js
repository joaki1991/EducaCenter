// Voy a crear un archivo de configuración para la API
// Si option es "local", la API será localhost/api y si es "backend", la API será localhost/backend/api
const option = "local";

let API_BASE; // Declare API_BASE outside the blocks

if (option === "local") {
    // Localhost
    API_BASE = 'http://localhost/EducaCenter_Backend/api';
}
if (option === "backend") { 
    // Backend
    API_BASE = 'http://educacenter.wuaze.com/api';
}

export default API_BASE;