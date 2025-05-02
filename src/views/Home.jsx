import React, { useState } from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import NewsCarousel from '../components/NewsCarousel';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import NewPasswordDialog from '../components/NewPasswordDialog';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';

function Home({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');

  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      onMessages={() => console.log('Messages')}
      logoImage={logo}
      onOpenSettings={() => setSettingsOpen(true)}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

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
        <NewsCarousel />
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

export default Home;