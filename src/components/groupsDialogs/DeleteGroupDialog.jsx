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

const DeleteGroupDialog = ({ open, onClose, group, onGroupDeleted }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleDelete = () => {
      api.delete('/groups.php', {
        data: { id: group.id }
      })
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Grupo eliminado correctamente',
          severity: 'success'
        });
        if (typeof onGroupDeleted === 'function') {
          onGroupDeleted();
        }
        onClose(true); // Notifica al padre que debe recargar
      })
      .catch(err => {
        console.error('Error al eliminar el grupo:', err);
        setSnackbar({
          open: true,
          message: 'Error al eliminar el grupo',
          severity: 'error'
        });
      });
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
         {group ? (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar a {group.name} 
            </Typography>
          ) : (
            <Typography variant="body1">
              Cargando datos del grupo...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={!group}>
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

export default DeleteGroupDialog;