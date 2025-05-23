import React from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  CircularProgress
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const AbsencesPanel = ({ absences, loading, error, isEditable, onAdd, onEdit, onDelete }) => {
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Faltas</Typography>
        {isEditable && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={onAdd}
          >
            Añadir Falta
          </Button>
        )}
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : absences.length === 0 ? (
        <Typography>No hay faltas registradas.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Fecha</TableCell>
                <TableCell>Justificada</TableCell>
                {isEditable && <TableCell align="center">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {absences.map((absence) => (
                <TableRow key={absence.id}>
                  <TableCell>{absence.date}</TableCell>
                  <TableCell>{absence.justified ? 'Sí' : 'No'}</TableCell>
                  {isEditable && (
                    <TableCell align="center">
                      <IconButton color="primary" size="small" onClick={() => onEdit(absence)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" size="small" onClick={() => onDelete(absence)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AbsencesPanel;
