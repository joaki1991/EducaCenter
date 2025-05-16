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
import { Edit, Delete } from '@mui/icons-material';

const GroupsPanel = ({ groups, onAdd, onEdit, onDelete }) => {
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Gestión de Grupos</Typography>
        <Button
          type="button"
          variant="contained"
          color="primary"
          onClick={onAdd}
        >
          Añadir Grupo
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>             
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>                
                <TableCell align="center">
                  <Button
                    type="button"
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => onEdit(group)}
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
                    onClick={() => onDelete(group.id)}
                    startIcon={<Delete />}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GroupsPanel;