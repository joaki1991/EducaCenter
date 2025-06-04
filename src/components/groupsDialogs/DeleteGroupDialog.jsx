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

// Componente DeleteGroupDialog: diálogo para confirmar y eliminar un grupo
// Muestra mensaje de confirmación y feedback de éxito o error
// Realiza la petición a la API para eliminar el grupo
const DeleteGroupDialog = ({ open, onClose, group, onGroupDeleted }) => {
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // Estado para el estado de carga durante la eliminación
  const [deleting, setDeleting] = useState(false);

  // Maneja la eliminación del grupo llamando a la API
  const handleDelete = async () => {
    setDeleting(true); // Inicia el estado de carga

    try {
      await api.delete('/groups.php', {
        data: { id: group.id }
      });
      setSnackbar({
        open: true,
        message: 'Grupo eliminado correctamente',
        severity: 'success'
      });
      if (typeof onGroupDeleted === 'function') {
        onGroupDeleted();
      }
      onClose(true); // Notifica al padre que debe recargar
    } catch (err) {
      console.error('Error al eliminar el grupo:', err);
      setSnackbar({
        open: true,
        message: 'Error al eliminar el grupo',
        severity: 'error'
      });
    } finally {
      setDeleting(false); // Termina el estado de carga
    }
  };

  // Render principal del diálogo de confirmación de eliminación
  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Confirmación de eliminación</DialogTitle>
        <DialogContent>
          {group ? (
            <Typography variant="body1">
              ¿Estás seguro de que deseas eliminar a {group.name}?
            </Typography>
          ) : (
            <Typography variant="body1">
              Cargando datos del grupo...
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
            disabled={!group || deleting} // Deshabilita el botón si no hay grupo o si está eliminando
            startIcon={deleting ? <CircularProgress size={20} /> : null} // Muestra el spinner mientras se elimina
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

export default DeleteGroupDialog;