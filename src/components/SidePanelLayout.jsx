import React, { useState } from 'react';
import { Box, IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const SidePanelLayout = ({ children, header }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));  // Detectamos si es un móvil

  // Definir el ancho del panel dependiendo si es móvil o no
  const drawerWidth = isMobile ? '100%' : '250px';  // En móviles, panel lateral ocupa el 100% de la pantalla

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Panel lateral fijo */}
      {open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: drawerWidth,  // Usamos el ancho calculado
            height: '100vh',
            backgroundColor: '#e3f2fd',
            p: 2,
            boxShadow: 3,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Botón de cerrar panel */}
          <IconButton
            onClick={() => setOpen(false)}
            sx={{
              ...(isMobile
                ? {}
                : {
                    alignSelf: 'flex-end',
                    position: 'absolute',
                  }),
              top: 10,
              right: 10,
              zIndex: 1400,
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Contenido del panel lateral */}
          <Typography variant="h6">Menú</Typography>
          <Typography>Opción 1</Typography>
          <Typography>Opción 2</Typography>
        </Box>
      )}

      {/* Wrapper desplazable */}
      <Box
        sx={{
          width: '100%',
          marginLeft: open ? '260px' : 0,  // El contenedor también se mueve según el ancho del panel
          transition: 'margin-left 0.3s ease',
        }}
      >
        {/* Header */}
        {header}

        {/* Botón menú debajo del header */}
        {!open && (
          <Box sx={{ mt: 2, ml: 2 }}>
            <IconButton
              onClick={() => setOpen(true)}
              sx={{
                backgroundColor: '#fff',
                boxShadow: 1,
                '&:hover': { backgroundColor: '#bbdefb' },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        )}

        {/* Contenido principal */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default SidePanelLayout;