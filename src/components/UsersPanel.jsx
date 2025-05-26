// Panel para mostrar y gestionar la lista de usuarios
// Permite agregar, editar, eliminar y vincular usuarios
// Muestra una tabla con los datos y botones de acción
import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { Edit, Delete, Link as LinkIcon } from '@mui/icons-material';

// Componente UsersPanel: muestra y gestiona la lista de usuarios
// Permite agregar, editar, eliminar y vincular usuarios mediante botones de acción
const UsersPanel = ({ users, onAdd, onEdit, onDelete, onLink }) => {
  return (
    <Box p={2}>
      {/* Encabezado y botón para añadir usuario */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Gestión de Usuarios</Typography>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={onAdd}
        >
          Añadir Usuario
        </Button>
      </Box>

      {/* Tabla de usuarios con acciones */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Apellidos</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Grupo</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Renderiza cada usuario y sus botones de acción */}
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surname || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.group_name || '-'}</TableCell>
                <TableCell align="center">
                  {/* Botón para editar usuario */}
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => onEdit(user)}
                    startIcon={<Edit />}
                    sx={{ mr: 1 }}
                  >
                    Editar
                  </Button>
                  {/* Botón para eliminar usuario */}
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(user.id)}
                    startIcon={<Delete />}
                    sx={{ mr: 1 }}
                  >
                    Eliminar
                  </Button>
                  {/* Botón para vincular usuario (solo si no es admin ni parent) */}
                  {user.role !== 'admin' && user.role !== 'parent' && (
                    <Button
                      type="button"
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => onLink(user)}
                      startIcon={<LinkIcon />}
                    >
                      Vincular
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default UsersPanel;