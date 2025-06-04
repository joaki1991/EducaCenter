import React from 'react';
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

// Componente DeleteAbsenceDialog: diálogo para confirmar y eliminar una falta de asistencia
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar la falta
const DeleteAbsenceDialog = ({ open, onClose, absence }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estado para controlar si se está realizando la eliminación
  const [deleting, setDeleting] = React.useState(false);

  // Maneja la eliminación de la falta llamando a la API
  const handleDelete = async () => {
    if (!absence) return;
    setDeleting(true); // comienza la eliminación
    try {
      await api.delete('/absences.php', {
        data: { id: absence.id }
      });
      setSnackbar({
        open: true,
        message: 'Falta eliminada correctamente',
        severity: 'success'
      });
      onClose(true);
    } catch (err) {
      console.error('Error al eliminar la falta:', err);
      setSnackbar({
        open: true,
        message: 'Error al eliminar la falta',
        severity: 'error'
      });
    } finally {
      setDeleting(false); // termina la eliminación
    }
  };

  // Render principal del diálogo de confirmación de eliminación
  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          {absence ? (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar la falta del día <strong>{absence.date}</strong>?
            </Typography>
          ) : (
            <Typography variant="body1">
              Cargando datos de la falta...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)} color="secondary" disabled={deleting}>
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={!absence || deleting}
            startIcon={deleting ? <CircularProgress size={20} /> : null}
          >
            {deleting ? 'Eliminando...' : 'Borrar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mostrar mensajes de éxito o error */}
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

export default DeleteAbsenceDialog;