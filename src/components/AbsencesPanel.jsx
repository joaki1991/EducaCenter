// Panel para mostrar y gestionar la lista de faltas de asistencia
// Permite agregar, editar y eliminar faltas según el rol
// Muestra una tabla con los datos, estados de carga y botones de acción
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
  Skeleton,
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
  // Obtiene el rol del usuario desde localStorage para controlar permisos de edición
  const userRole = localStorage.getItem('EducaCenterRole');

  // Número de filas skeleton a mostrar durante la carga
  const skeletonRows = 5;

  // Render principal del panel de faltas de asistencia
  return (
    <Box p={2}>
      {/* Encabezado y botón para añadir falta si el usuario es profesor */}
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

      {/* Tabla de carga (skeleton), error, vacío o datos reales */}
      {loading ? (
        // Muestra tabla skeleton mientras se cargan los datos
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {isEditable && <TableCell><Skeleton width={80} /></TableCell>}
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                <TableCell><Skeleton width={80} /></TableCell>
                {isEditable && <TableCell><Skeleton width={80} /></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {[...Array(skeletonRows)].map((_, index) => (
                <TableRow key={index}>
                  {isEditable && (
                    <TableCell>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  )}
                  <TableCell>
                    <Skeleton variant="rectangular" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={30} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" height={30} />
                  </TableCell>
                  {isEditable && (
                    <TableCell>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : error ? (
        // Muestra mensaje de error si ocurre un error
        <Typography color="error">{error}</Typography>
      ) : absences.length === 0 ? (
        // Muestra mensaje si no hay faltas registradas
        <Typography>No hay faltas de asistencia registradas.</Typography>
      ) : (
        // Muestra la tabla de faltas con acciones si hay datos
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