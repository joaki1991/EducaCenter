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

const DeleteNewDialog = ({ open, onClose, announcement }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

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