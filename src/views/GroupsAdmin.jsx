// Vista de administración de grupos
// Permite ver, agregar, editar y eliminar grupos
// Incluye panel de grupos y diálogos de gestión

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import GroupsPanel from '../components/GroupsPanel'; // Panel para mostrar grupos
import api from '../api/axios'; 
import AddGroupDialog from '../components/groupsDialogs/AddGroupDialog'; 
import EditGroupDialog from '../components/groupsDialogs/EditGroupDialog'; 
import DeleteGroupDialog from '../components/groupsDialogs/DeleteGroupDialog'; 

function GroupsAdmin({ onLogout }) {
  // Maneja la apertura/cierre del diálogo de foto de perfil
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  // Lista de grupos y estado de carga
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para los diálogos de agregar, editar y eliminar grupo
  const [addGroupDialogOpen, setAddGroupDialogOpen] = useState(false);
  const [editGroupDialogOpen, setEditGroupDialogOpen] = useState(false);
  const [deleteGroupDialogOpen, setDeleteGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // Obtiene datos del usuario logueado
  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');

  // Carga la lista de grupos al montar el componente
  useEffect(() => {
    setLoading(true);
    api.get('/groups.php')  
      .then(res => {
        if (Array.isArray(res.data)) {
          setGroups(res.data);
        } else {
          console.warn('Respuesta inesperada:', res.data);
          setGroups([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar grupos:', err);
        setGroups([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Abre el diálogo para agregar un grupo
  const handleAddGroup = () => {
    setSelectedGroup(null);
    setAddGroupDialogOpen(true);
  };

  // Abre el diálogo para editar un grupo existente
  const handleEditGroup = (group) => {
    setSelectedGroup(group);
    setEditGroupDialogOpen(true);
  };

  // Abre el diálogo para eliminar un grupo existente
  const handleDeleteGroup = (groupId) => {
    const groupToDelete = groups.find(g => g.id === groupId);
    setSelectedGroup(groupToDelete);
    setDeleteGroupDialogOpen(true);
  };

  // Cabecera personalizada para la vista
  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  // Renderiza un esqueleto de carga para la tabla de grupos
  const renderLoadingSkeleton = () => (
    <Box p={2}>
      <Typography variant="h5" mb={2}>Gestión de Grupos</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>             
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(5)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(2)].map((__, colIndex) => (
                  <TableCell key={colIndex}>
                    <Skeleton variant="text" animation="wave" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  // Recarga la lista de grupos tras una acción (agregar, editar, eliminar)
  const reloadGroups = () => {
    setLoading(true);
    api.get('/groups.php')  
      .then(res => {
        if (Array.isArray(res.data)) {
          setGroups(res.data);
        } else {
          console.warn('Respuesta inesperada:', res.data);
          setGroups([]);
        }
      })
      .catch(err => {
        console.error('Error al cargar grupos:', err);
        setGroups([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

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
        {loading ? (
          renderLoadingSkeleton()
        ) : (
          <GroupsPanel
            groups={groups}
            onAdd={handleAddGroup}
            onEdit={handleEditGroup}
            onDelete={handleDeleteGroup}
          />
        )}
      </SidePanelLayout>

      {/* Diálogos para grupos */}
      <AddGroupDialog
        open={addGroupDialogOpen}
        onClose={(updated) => {
          setAddGroupDialogOpen(false);
          if (updated) reloadGroups();
        }}
        type="add"
      />
      <EditGroupDialog
        open={editGroupDialogOpen}
        onClose={(updated) => {
          setEditGroupDialogOpen(false);
          if (updated) reloadGroups();
        }}
        type="edit"
        group={selectedGroup}
      />
      <DeleteGroupDialog
        open={deleteGroupDialogOpen}
        onClose={(updated) => {
          setDeleteGroupDialogOpen(false);
          if (updated) reloadGroups();
        }}
        type="delete"
        group={selectedGroup}
      />

      {/* Diálogos existentes */}

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

export default GroupsAdmin;