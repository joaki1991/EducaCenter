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

const DeleteUserDialog = ({ open, onClose, user, onUserDeleted }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleDelete = () => {
      api.delete('/users.php', {
        data: { id: user.id } // El id va en el body como JSON
      })
      .then(()=> {
        setSnackbar({
          open: true,
          message: 'Usuario eliminado correctamente',
          severity: 'success'
        });
        
        // Llamamos al método que recargará la lista de usuarios en el componente principal
        if (typeof onUserDeleted === 'function') {
          onUserDeleted(); // Recargar usuarios o realizar cualquier otra acción
        }
        onClose(); // Cerramos el modal
      })
      .catch(err => {
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
      <Dialog open={open} onClose={onClose}>
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