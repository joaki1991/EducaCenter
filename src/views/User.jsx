import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box, Typography, Button, Container, Avatar, CircularProgress } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import NewPasswordDialog from '../components/NewPasswordDialog';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';

function User({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem('EducaCenterId');

  // Obtener datos del usuario de la API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${API_BASE}/users.php?id=${userId}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error al obtener los datos del usuario', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const header = (
    <Header
      userName={userData ? `${userData.firstName} ${userData.lastName}` : 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      onMessages={() => console.log('Messages')}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  if (!userData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <SidePanelLayout header={header}>
        <Container sx={{ backgroundColor: '#fff', borderRadius: 2, padding: 3, mt: 5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 120, height: 120 }}
              src={`${API_BASE}/profile_photo/${userId}.jpg`}
              alt="Foto de perfil"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API_BASE}/profile_photo/default.jpg`; // Imagen por defecto en caso de error
              }}
            />
          </Box>
          
          <Typography variant="h5" align="center">{`${userData.firstName} ${userData.lastName}`}</Typography>
          <Typography variant="body1" align="center">{`Correo: ${userData.email}`}</Typography>

          {/* Mostrar grupo y padre si existen */}
          {userData.group && (
            <Typography variant="body1" align="center">{`Grupo: ${userData.group_name || '-'}`}</Typography>
          )}
          {userData.parent && (
            <Typography variant="body1" align="center">{`Padre: ${userData.parent_name || '-'}`}</Typography>
          )}

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setSettingsOpen(true)}
            >
              Cambiar contraseña
            </Button>
          </Box>
        </Container>
      </SidePanelLayout>

      <NewPasswordDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userId={userId}
      />

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

export default User;