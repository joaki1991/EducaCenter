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
import { Add, Edit, Delete, Visibility } from '@mui/icons-material';

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
  const userRole = localStorage.getItem('EducaCenterRole');

  const skeletonRows = 5;

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
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {isEditable && <TableCell><Skeleton width={100} /></TableCell>}
                <TableCell><Skeleton width={100} /></TableCell>
                <TableCell><Skeleton width={100} /></TableCell>
                {onView && <TableCell><Skeleton width={100} /></TableCell>}
                {isEditable && <TableCell><Skeleton width={100} /></TableCell>}
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
                  {onView && (
                    <TableCell>
                      <Skeleton variant="rectangular" height={30} />
                    </TableCell>
                  )}
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
                {onView && <TableCell align="center">Visualizar</TableCell>}
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
                  {onView && (
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        color="info"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => onView(report)}
                      >
                        Ver
                      </Button>
                    </TableCell>
                  )}
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
                        onClick={() => onDelete(report)}
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