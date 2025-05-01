// Componenete para el tema de Material-UI, cambia la fuente de la aplicacion a Poppins
import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins'; // importa la fuente

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif',
  },
});

export default theme;