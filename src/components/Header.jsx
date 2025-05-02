import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import defaultUserImage from '../assets/default-user.png'; 

const Header = ({ userName, userImage, onLogout, onMessages, logoImage, onOpenSettings, onOpenPhotoUpdate }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <AppBar
      position="static"
      elevation={3}
      sx={{
        backgroundColor: '#1E3A8A', // azul marino
        color: '#FFFFFF',           // texto blanco
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
        {/* Logo */}
        <Box
          sx={{
            position: isMobile ? 'static' : 'absolute',
            left: 0,
            right: 0,
            margin: '0 auto',
            display: 'flex',
            justifyContent: 'center',
            mb: isMobile ? 2 : 0,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          <img
            src={logoImage}
            alt="EducaCenter Logo"
            style={{
              maxWidth: '150px',
              width: '100%',
              height: 'auto',
            }}
          />
        </Box>

        {/* Usuario + Iconos */}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5 }}>
            <IconButton>
              <Avatar onClick={onOpenPhotoUpdate} src={userImage} alt={userName} sx={{ width: 60, height: 60, backgroundColor: 'grey' }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = defaultUserImage; 
                }}
              >
                {userName?.[0]}
              </Avatar>
            </IconButton>
            <IconButton onClick={onOpenSettings} sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1976d2' }, borderRadius: 8 }}>
              <Typography
                variant="body3"
                sx={{
                  fontWeight: 700,
                  color: '#FFFFFF', // aseguramos que el texto también sea blanco
                  px: 1,
                  py: 1,
                }}
              >
                {userName}
              </Typography>
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <IconButton onClick={onMessages} sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1976d2' } }}>
              <MailIcon />
            </IconButton>
            <IconButton onClick={onLogout} sx={{ color: '#FFFFFF', '&:hover': { backgroundColor: '#1976d2' } }}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;