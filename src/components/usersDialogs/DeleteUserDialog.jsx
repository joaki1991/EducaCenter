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

// Componente DeleteUserDialog: diálogo para confirmar y eliminar un usuario
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar el usuario
const DeleteUserDialog = ({ open, onClose, user, onUserDeleted }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Maneja la eliminación del usuario llamando a la API
  const handleDelete = () => {
      api.delete('/users.php', {
        data: { id: user.id }
      })
      .then(()=> {
        setSnackbar({
          open: true,
          message: 'Usuario eliminado correctamente',
          severity: 'success'
        });
        if (typeof onUserDeleted === 'function') {
          onUserDeleted();
        }
        onClose(true); // Notifica al padre que debe recargar
      })
      .catch(err => {
        // Manejo de error al eliminar el usuario
        console.error('Error al eliminar el usuario:', err);
        setSnackbar({
          open: true,
          message: 'Error al eliminar el usuario',
          severity: 'error'
        });
      });
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          {user ? (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar a {user.name} {user.surname}?
            </Typography>
          ) : (
            <Typography variant="body1">
              Cargando datos del usuario...
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={!user}>
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

export default DeleteUserDialog;