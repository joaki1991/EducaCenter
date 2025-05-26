import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../api/axios';

// Componente DeleteNewDialog: diálogo para confirmar y eliminar una noticia
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar la noticia
const DeleteNewDialog = ({ open, onClose, announcement }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Maneja la eliminación de la noticia llamando a la API
  const handleDelete = () => {
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
          <Button onClick={() => onClose(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={!announcement}
          >
            Borrar
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