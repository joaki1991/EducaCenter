import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
  Collapse,  
  Stack,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

// Componente de layout con panel lateral de navegación
// Permite abrir/cerrar el menú lateral y navegar entre vistas principales
// Muestra botones según el rol del usuario
const SidePanelLayout = ({ children, header }) => {
  const [open, setOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const drawerWidth = isMobile ? '100%' : '260px';
  const navigate = useNavigate();
  const role = localStorage.getItem('EducaCenterRole'); 

  return (
    <Box sx={{ display: 'flex' }}>
      {open && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: drawerWidth,
            height: '100vh',
            backgroundColor: '#e8f0fe', // azul claro
            p: 3,
            boxShadow: 3,
            zIndex: 1300,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          {/* Encabezado y botón de cerrar */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold" color="#1a237e">
                MENÚ
              </Typography>
              <IconButton onClick={() => setOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>           

            {/* Botones principales */}
            <Stack spacing={1.5} sx={{ mt: 4 }}>
              <Button fullWidth variant="contained" sx={btnStyle} onClick={() => navigate('/usuario')}>Usuario</Button>
              <Button fullWidth variant="contained" sx={btnStyle} onClick={() => navigate('/mensajes')}>Mensajes</Button>
              <Button fullWidth variant="contained" sx={btnStyle} onClick={() => navigate('/faltas')}>Faltas de asistencia</Button>
              <Button fullWidth variant="contained" sx={btnStyle} onClick={() => navigate('/informes')}>Informe de alumnado</Button>

              {(role === 'admin' || role === 'teacher') && (
                <Button fullWidth variant="contained" sx={btnStyle} onClick={() => navigate('/noticias')}>Noticias</Button>
              )}
              {(role === 'student' || role === 'parent') && (
                <Button fullWidth variant="contained" sx={btnStyle} onClick={() => navigate('/')}>Noticias</Button>
              )}

              {role === 'admin' && (
                <>
                  <Button
                    fullWidth
                    variant="contained"
                    sx={btnStyle}
                    onClick={() => setAdminOpen(!adminOpen)}
                  >
                    Administración
                  </Button>
                  <Collapse in={adminOpen}>
                    <Box
                      sx={{
                        mt: 1,
                        pl: 2,
                        pt: 1,
                        pb: 1,
                        backgroundColor: '#d0e3fc',
                        borderRadius: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1,
                      }}
                    >
                      <Button variant="text" sx={subBtnStyle} onClick={() => navigate('/admin/usuarios')}>Usuarios</Button>
                      <Button variant="text" sx={subBtnStyle} onClick={() => navigate('/admin/grupos')}>Grupos</Button>
                    </Box>
                  </Collapse>
                </>
              )}
            </Stack>
          </Box>          
        </Box>
      )}

      {/* Contenido principal */}
      <Box
        sx={{
          width: '100%',
          marginLeft: open && !isMobile ? drawerWidth : 0,
          transition: 'margin-left 0.3s ease',
        }}
      >
        {header}

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

        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
};

// Estilos reutilizables
const btnStyle = {
  backgroundColor: '#1976d2',
  color: 'white',
  textTransform: 'none',
  fontWeight: 'bold',
  borderRadius: 2,
  '&:hover': {
    backgroundColor: '#1565c0',
  },
};

const subBtnStyle = {
  justifyContent: 'flex-start',
  textTransform: 'none',
  fontWeight: 'bold',
  color: '#1a237e',
  pl: 1,
  '&:hover': {
    backgroundColor: '#bbdefb',
  },
};

export default SidePanelLayout;