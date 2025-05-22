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

const Header = ({ userName, userImage, onLogout, logoImage, onOpenPhotoUpdate }) => {
  const isMobile = useMediaQuery('(max-width:1050px)');
  const navigate = useNavigate();

  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const response = await api.get('/messages.php');
        const data = response.data;
        const userId = localStorage.getItem('EducaCenterId');

        const unreadExists = data.some(
          (msg) => msg.receiver_id === Number(userId) && msg.is_read !== 1
        );

        setHasUnreadMessages(unreadExists);
      } catch (error) {
        console.error('Error al comprobar mensajes no leídos:', error);
      }
    };

    fetchUnreadMessages();
  }, []);

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

          <Box sx={{ display: 'flex', gap: 1.5 }}>
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