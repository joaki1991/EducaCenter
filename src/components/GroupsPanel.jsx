// Panel para mostrar y gestionar la lista de grupos
// Permite agregar, editar y eliminar grupos
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
import { Edit, Delete } from '@mui/icons-material';

// Componente GroupsPanel: muestra y gestiona la lista de grupos
// Recibe la lista de grupos y handlers para agregar, editar y eliminar
const GroupsPanel = ({ groups, onAdd, onEdit, onDelete }) => {
  // Render principal del panel de grupos
  return (
    <Box p={2}>
      {/* Encabezado y botón para añadir grupo */}
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

      {/* Tabla de grupos con acciones de editar y eliminar */}
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
                  {/* Botón para editar grupo */}
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
                  {/* Botón para eliminar grupo */}
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