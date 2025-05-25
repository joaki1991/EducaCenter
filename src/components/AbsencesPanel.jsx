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
  Paper,
  CircularProgress,
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const AbsencesPanel = ({
  absences,
  loading,
  error,
  isEditable,
  onAdd,
  onEdit,
  onDelete
}) => {
  const userRole = localStorage.getItem('EducaCenterRole');

  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Faltas de Asistencia</Typography>
        {isEditable && userRole === "teacher" && (
          <Button
            variant="contained"
            color="primary"
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
        <Typography>No hay faltas de asistencia registradas.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {isEditable && <TableCell>Estudiante</TableCell>}
                <TableCell>Profesor</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Justificada</TableCell>
                {isEditable && <TableCell align="center">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {absences.map((absence) => (
                <TableRow key={absence.id}>
                  {isEditable && <TableCell>{absence.student_name || absence.student_id}</TableCell>}
                  <TableCell>{absence.teacher_name || absence.teacher_id}</TableCell>
                  <TableCell>
                    {absence.date && !isNaN(new Date(absence.date).getTime())
                      ? new Date(absence.date).toLocaleDateString()
                      : 'Fecha no válida'}
                  </TableCell>
                  <TableCell>{absence.justified === 1 ? 'Sí' : 'No'}</TableCell>
                  {isEditable && (
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => onEdit(absence)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => onDelete(absence)}
                      >
                        Eliminar
                      </Button>
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