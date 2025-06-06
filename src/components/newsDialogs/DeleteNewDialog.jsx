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

// Componente DeleteNewDialog: diálogo para confirmar y eliminar una noticia
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar la noticia
const DeleteNewDialog = ({ open, onClose, announcement }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // Estado de carga (loading)
  const [deleting, setDeleting] = useState(false);

  // Maneja la eliminación de la noticia llamando a la API
  const handleDelete = () => {
    if (!announcement) return;

    setDeleting(true); // Inicia el proceso de eliminación

    api.delete('/announcements.php', {
      data: { id: announcement.id }
    })
    .then(() => {
      setSnackbar({
        open: true,
        message: 'Anuncio eliminado correctamente',
        severity: 'success'
      });
      onClose(true); // Notifica al padre que se debe recargar
    })
    .catch(err => {
      // Manejo de error al eliminar el anuncio
      console.error('Error al eliminar el anuncio:', err);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el anuncio',
        severity: 'error'
      });
    })
    .finally(() => {
      setDeleting(false); // Finaliza el proceso de eliminación
    });
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          {announcement ? (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar el anuncio "{announcement.title}"?
            </Typography>
          ) : (
            <Typography variant="body1">
              Cargando datos del anuncio...
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
            disabled={!announcement || deleting} // Deshabilita el botón mientras se está eliminando
            startIcon={deleting ? <CircularProgress size={20} color="inherit" /> : null} // Spinner mientras se elimina
          >
            {deleting ? 'Eliminando...' : 'Borrar'}
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

export default DeleteNewDialog;