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
  CircularProgress,
  Button,
  IconButton,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';

const ReportsPanel = ({
  reports,
  loading,
  error,
  isEditable,
  onAdd,
  onEdit,
  onDelete,
  onView
}) => {
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Informes Académicos</Typography>
        {isEditable && (
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
                <TableCell>Estudiante</TableCell>
                <TableCell>Asignatura</TableCell>
                <TableCell>Fecha</TableCell>                
                {isEditable && <TableCell align="center">Acciones</TableCell>}
                <TableCell align="center">Visualizar</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.student_name || report.student_id}</TableCell>
                  <TableCell>{report.subject}</TableCell>
                  <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>                  
                  {isEditable && (
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => onEdit(report)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(report)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  )}
                  <TableCell align="center">
                    <IconButton
                      color="default"
                      size="small"
                      onClick={() => onView(report)}
                    >
                      <Visibility />
                    </IconButton>
                  </TableCell>
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