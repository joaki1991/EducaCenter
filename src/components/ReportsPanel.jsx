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
import { Add, Edit, Delete } from '@mui/icons-material';

const ReportsPanel = ({
  reports,
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
        <Typography variant="h5">Informes Académicos</Typography>
        {isEditable && userRole === "teacher" && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<Add />}
            onClick={onAdd}
          >
            Añadir Informe
          </Button>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : reports.length === 0 ? (
        <Typography>No hay informes disponibles.</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {isEditable && <TableCell>Estudiante</TableCell>}
                <TableCell>Profesor</TableCell>
                <TableCell>Fecha</TableCell>
                {isEditable && <TableCell align="center">Acciones</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  {isEditable && <TableCell>{report.student_name || report.student_id}</TableCell>}
                  <TableCell>{report.teacher_name || report.teacher_id}</TableCell>
                  <TableCell>
                    {report.created_at && !isNaN(new Date(report.created_at).getTime())
                      ? new Date(report.created_at).toLocaleDateString()
                      : 'Fecha no válida'}
                  </TableCell>
                  {isEditable && (
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => onEdit(report)}
                        sx={{ mr: 1 }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => onDelete(report.id)}
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

export default ReportsPanel;