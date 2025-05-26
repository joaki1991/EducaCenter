import React, { useEffect, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import Badge from '@mui/material/Badge';
import useMediaQuery from '@mui/material/useMediaQuery';
import defaultUserImage from '../assets/default-user.png';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios'; 

// Componente Header: cabecera principal de la aplicación
// Muestra el nombre e imagen del usuario, iconos de mensajes y logout, y el logo
// Incluye lógica para mostrar si hay mensajes no leídos
const Header = ({ userName, userImage, onLogout, logoImage, onOpenPhotoUpdate }) => {
  // Detecta si la pantalla es móvil para ajustar el layout
  const isMobile = useMediaQuery('(max-width:1050px)');
  const navigate = useNavigate();

  // Estado para saber si hay mensajes no leídos
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  // Efecto para consultar si existen mensajes no leídos para el usuario
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await api.get('/messages.php');
        const data = response.data;
        const userId = localStorage.getItem('EducaCenterId');

        // Verifica si hay algún mensaje no leído para el usuario actual
        const unreadExists = data.some(
          (msg) => msg.receiver_id === Number(userId) && msg.is_read !== 1
        );

        setHasUnreadMessages(unreadExists);
      } catch (error) {
        // Manejo de error al consultar mensajes
        console.error('Error al comprobar mensajes no leídos:', error);
      }
    };

    fetchUnreadMessages();
  }, []);

  // Render principal del header con logo, usuario, iconos de mensajes y logout
  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundColor: '#1E3A8A',
        color: '#FFFFFF',
        paddingY: 2,
      }}
    >
      <Toolbar
        sx={{
          position: 'relative',
          flexDirection: isMobile ? 'column' : 'row',
          paddingX: 2,
        }}
      >
        {/* Logo de la aplicación */}
        <Box
          sx={{
            position: isMobile ? 'static' : 'absolute',
            left: 0,
            right: 0,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            mb: isMobile ? 2 : 0,
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <Box
            onClick={() => navigate('/')}
            sx={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            <img
              src={logoImage}
              alt="EducaCenter Logo"
              style={{ maxWidth: '150px', width: '100%', height: 'auto' }}
            />
          </Box>
        </Box>

        {/* Sección de usuario e iconos */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            zIndex: 1,
            gap: isMobile ? 1.5 : 0,
          }}
        >
          {/* Avatar y nombre del usuario */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5 }}>
            <IconButton>
              <Avatar
                onClick={onOpenPhotoUpdate}
                src={userImage}
                alt={userName}
                sx={{ width: 60, height: 60, backgroundColor: 'grey' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultUserImage;
                }}
              >
                {userName?.[0]}
              </Avatar>
            </IconButton>
            <IconButton
              onClick={() => navigate('/usuario')}
              sx={{
                color: '#FFFFFF',
                '&:hover': { backgroundColor: '#1976d2' },
                borderRadius: 8,
              }}
            >
              <Typography
                variant="body3"
                noWrap
                title={userName}
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF',
                  maxWidth: isMobile ? 150 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  px: 1,
                  py: 1,
                }}
              >
                {userName}
              </Typography>
            </IconButton>
          </Box>

          {/* Iconos de mensajes y logout */}
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            {/* Icono de mensajes con badge si hay mensajes no leídos */}
            <IconButton
              onClick={() => navigate('/mensajes')}
              sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1976d2' } }}
            >
              <Badge
                color="error"
                variant="dot"
                overlap="circular"
                invisible={!hasUnreadMessages}
              >
                <MailIcon />
              </Badge>
            </IconButton>

            {/* Icono de logout */}
            <IconButton
              onClick={onLogout}
              sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1976d2' } }}
            >
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;