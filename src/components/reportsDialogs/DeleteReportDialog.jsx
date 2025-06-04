// Diálogo para confirmar y eliminar un informe académico
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar el informe
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../../api/axios';

const DeleteReportDialog = ({ open, onClose, report }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estado para controlar el proceso de carga (loading)
  const [loading, setLoading] = useState(false);

  // Maneja la eliminación del informe llamando a la API
  const handleDelete = () => {
    setLoading(true); // Inicia el proceso de carga

    api.delete('/reports.php', {
      data: { id: report.id }
    })
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Informe eliminado correctamente',
          severity: 'success'
        });
        onClose(true); // Indica que debe recargarse la lista
      })
      .catch(err => {
        // Manejo de error al eliminar el informe
        console.error('Error al eliminar el informe:', err);
        setSnackbar({
          open: true,
          message: 'Error al eliminar el informe',
          severity: 'error'
        });
      })
      .finally(() => {
        setLoading(false); // Finaliza el proceso de carga
      });
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          {report ? (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar este informe?
            </Typography>
          ) : (
            <Typography variant="body1">
              Cargando datos del informe...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} color="secondary" disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={loading || !report} // Deshabilita el botón mientras se está eliminando
            startIcon={loading ? <CircularProgress size={20} /> : null} // Muestra el spinner de carga
          >
            {loading ? 'Eliminando...' : 'Borrar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default DeleteReportDialog;