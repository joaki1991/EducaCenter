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

const UsersPanel = ({ users, onAdd, onEdit, onDelete, onLink }) => {
  return (
    <Box p={2}>
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
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.surname || '-'}</TableCell>
                <TableCell>{user.email || '-'}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.group_name || '-'}</TableCell>
                <TableCell align="center">
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
                  {/* Solo mostrar el botón "Vincular" si el rol no es "admin" o "parent" */}
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