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

const DeleteAbsenceDialog = ({ open, onClose, absence }) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleDelete = () => {
    api.delete('/absences.php', {
      data: { id: absence.id }
    })
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Falta eliminada correctamente',
          severity: 'success'
        });
        onClose(true);
      })
      .catch(err => {
        console.error('Error al eliminar la falta:', err);
        setSnackbar({
          open: true,
          message: 'Error al eliminar la falta',
          severity: 'error'
        });
      });
  };

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
          <Button onClick={() => onClose(false)} color="secondary">
            Cancelar
          </Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
            disabled={!absence}
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

export default DeleteAbsenceDialog;