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

// Componente DeleteGroupDialog: diálogo para confirmar y eliminar un grupo
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar el grupo
const DeleteGroupDialog = ({ open, onClose, group, onGroupDeleted }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Maneja la eliminación del grupo llamando a la API
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
        // Manejo de error al eliminar el grupo
        console.error('Error al eliminar el grupo:', err);
        setSnackbar({
          open: true,
          message: 'Error al eliminar el grupo',
          severity: 'error'
        });
      });
  };

  // Render principal del diálogo de confirmación de eliminación
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

export default DeleteGroupDialog;