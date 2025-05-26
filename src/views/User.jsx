import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import {
  Box,
  Typography,
  Button,
  Container,
  Avatar,
  CircularProgress
} from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import api from '../api/axios';
import NewPasswordDialog from '../components/NewPasswordDialog';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';

function User({ onLogout }) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [parentName, setParentName] = useState(null);
  const [childrenName, setChildrenName] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('EducaCenterId');

  // Obtener datos del usuario de la API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/users.php?id=${userId}`);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const user = response.data[0];
          setUserData(user);

          // Si el usuario es estudiante, buscar el nombre del padre
          if (user.role === 'student') {
            fetchParentData(user.id);
          }else if (user.role === 'parent') {
            fetchChildrenData(user.id);
          }
        } else {
          console.warn('Respuesta inesperada:', response.data);
        }
      } catch (err) {
        console.error('Error al cargar datos del usuario:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchParentData = async (studentUserId) => {
      try {
        const studentResponse = await api.get(`/students.php?user_id=${studentUserId}`);
        if (
          studentResponse.data &&
          Array.isArray(studentResponse.data) &&
          studentResponse.data.length > 0
        ) {
          const parentId = studentResponse.data[0].parent_id;
          const parentData = await api.get(`/parents.php?id=${parentId}`);
          const userId = parentData.data[0].user_id;
          const parentUser = await api.get(`/users.php?id=${userId}`);
          if (
            parentUser.data &&
            Array.isArray(parentUser.data) &&
            parentUser.data.length > 0
          ) {
            const parent = parentUser.data[0];
            setParentName(`${parent.name} ${parent.surname}`);
          }
        }
      } catch (err) {
        console.error('Error al cargar datos del padre:', err);
      }
    };

    const fetchChildrenData = async (parentUserId) => {
      try {
        const parentResponse = await api.get(`/parents.php?user_id=${parentUserId}`);
        if (
          parentResponse.data &&
          Array.isArray(parentResponse.data) &&
          parentResponse.data.length > 0
        ) {
          const parentId = parentResponse.data[0].id;
          const childrenData = await api.get(`/students.php?parent_id=${parentId}`);
          if (
            childrenData.data &&
            Array.isArray(childrenData.data) &&
            childrenData.data.length > 0
          ) {
            const childrenUser = await api.get(`/users.php?id=${childrenData.data[0].user_id}`);
            const children = childrenUser.data[0]; 
            setChildrenName(`${children.name} ${children.surname}`);
          }
        }
      } catch (err) {
        console.error('Error al cargar datos del padre:', err);
      }
    };

    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const header = (
    <Header
      userName={userData ? `${userData.name} ${userData.surname}` : 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!userData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6">No se pudo cargar la información del usuario.</Typography>
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
              sx={{ width: 150, height: 150 }}
              src={`${API_BASE}/profile_photo/${userId}.jpg`}
              alt={`${userData.name} ${userData.surname}`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${API_BASE}/profile_photo/default.jpg`;
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Typography variant="h5" align="center">
              {`${userData.name} ${userData.surname}`}
            </Typography>

            <Typography variant="body1" align="center">
              {`Correo: ${userData.email}`}
            </Typography>

            <Typography variant="body1" align="center">
              {`Tipo de usuario: ${
                {
                  student: 'Estudiante',
                  teacher: 'Profesor',
                  admin: 'Administrador',
                  parent: 'Padre',
                }[userData.role] || 'Desconocido'
              }`}
            </Typography>

            {userData.group_name && (
              <Typography variant="body1" align="center">
                {`Grupo: ${userData.group_name || '-'}`}
              </Typography>
            )}

            {parentName && (
              <Typography variant="body1" align="center">
                {`Padre/Madre: ${parentName}`}
              </Typography>
            )}

            {childrenName && (
              <Typography variant="body1" align="center">
                {`Hijo/Hija: ${childrenName}`}
              </Typography>
            )}

            {userData.created_at && (
              <Typography variant="body1" align="center">
                {`Fecha de alta: ${new Date(userData.created_at).toLocaleDateString()}`}
              </Typography>
            )}
          </Box>

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