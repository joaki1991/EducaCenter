import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import NewPasswordDialog from '../components/NewPasswordDialog';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import UsersPanel from '../components/UsersPanel';
import api from '../api/axios'; // Tu instancia Axios personalizada

function UsersAdmin({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');

  useEffect(() => {
    api.get('/users.php')
      .then(res => {
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else {
          console.warn('Respuesta inesperada:', res.data);
          setUsers([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar usuarios:', err);
        setUsers([]);
      });
  }, []);

  const handleAddUser = () => {
    console.log('Añadir usuario');
  };

  const handleEditUser = (user) => {
    console.log('Editar usuario:', user);
  };

  const handleDeleteUser = (userId) => {
    console.log('Eliminar usuario con ID:', userId);
  };

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
        <UsersPanel
          users={users}
          onAdd={handleAddUser}
          onEdit={handleEditUser}
          onDelete={handleDeleteUser}
        />
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

export default UsersAdmin;