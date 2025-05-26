// Vista de perfil de usuario: muestra y permite editar información personal
// Muestra información personal, grupo, padre/hijo y permite cambiar contraseña o foto
// Incluye lógica para cargar datos según el tipo de usuario
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

// Componente de vista de usuario para mostrar y gestionar la información del usuario
function User({ onLogout }) {
  // Estados locales para controlar los diálogos y la información del usuario
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [parentName, setParentName] = useState(null);
  const [childrenName, setChildrenName] = useState(null);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('EducaCenterId');

  // Efecto para obtener los datos del usuario al montar el componente
  useEffect(() => {
    // Función para obtener los datos del usuario desde la API
    const fetchUserData = async () => {
      try {
        // Llamada a la API para obtener los datos del usuario
        const response = await api.get(`/users.php?id=${userId}`);
        if (response.data && Array.isArray(response.data) && response.data.length > 0) {
          const user = response.data[0];
          setUserData(user);

          // Si el usuario es estudiante, buscar el nombre del padre
          if (user.role === 'student') {
            fetchParentData(user.id);
          } else if (user.role === 'parent') {
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

    // Función para obtener el nombre del padre de un estudiante
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
        // Manejo de error al cargar datos del padre
        console.error('Error al cargar datos del padre:', err);
      }
    };

    // Función para obtener el nombre del hijo de un padre
    const fetchChildrenData = async (parentUserId) => {
      try {
        const parentResponse = await api.get(`/parents.php?user_id=${parentUserId}`);
        if (
          parentResponse.data &&
          Array.isArray(parentResponse.data) &&
          parentResponse.data.length > 0
        ) {
          const parentId = parentResponse.data[0].id;
          // Obtener los datos de los hijos asociados al padre
          const childrenData = await api.get(`/students.php?parent_id=${parentId}`);
          if (
            childrenData.data &&
            Array.isArray(childrenData.data) &&
            childrenData.data.length > 0
          ) {
            // Obtener los datos del usuario hijo
            const childrenUser = await api.get(`/users.php?id=${childrenData.data[0].user_id}`);
            const children = childrenUser.data[0]; 
            setChildrenName(`${children.name} ${children.surname}`);
          }
        }
      } catch (err) {
        // Manejo de error al cargar datos del hijo
        console.error('Error al cargar datos del padre:', err);
      }
    };

    // Si hay un usuario logueado, obtener sus datos
    if (userId) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [userId]);

  // Renderizado del header personalizado con datos del usuario
  const header = (
    <Header
      userName={userData ? `${userData.name} ${userData.surname}` : 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  // Mostrar un loader mientras se cargan los datos del usuario
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar mensaje si no se pudo cargar la información del usuario
  if (!userData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="h6">No se pudo cargar la información del usuario.</Typography>
      </Box>
    );
  }

  // Renderizado principal de la vista de usuario
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
          {/* Avatar del usuario */}
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

          {/* Información del usuario */}
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

            {/* Grupo del usuario si existe */}
            {userData.group_name && (
              <Typography variant="body1" align="center">
                {`Grupo: ${userData.group_name || '-'}`}
              </Typography>
            )}

            {/* Nombre del padre si es estudiante */}
            {parentName && (
              <Typography variant="body1" align="center">
                {`Padre/Madre: ${parentName}`}
              </Typography>
            )}

            {/* Nombre del hijo si es padre */}
            {childrenName && (
              <Typography variant="body1" align="center">
                {`Hijo/Hija: ${childrenName}`}
              </Typography>
            )}

            {/* Fecha de alta del usuario */}
            {userData.created_at && (
              <Typography variant="body1" align="center">
                {`Fecha de alta: ${new Date(userData.created_at).toLocaleDateString()}`}
              </Typography>
            )}
          </Box>

          {/* Botón para cambiar contraseña */}
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

      {/* Diálogo para cambiar contraseña */}
      <NewPasswordDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        userId={userId}
      />

      {/* Diálogo para actualizar foto de perfil */}
      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

// Exportación del componente User
export default User;