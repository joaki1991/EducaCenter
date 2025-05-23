import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import api from '../api/axios';

const DeleteAbsenceDialog = ({ open, onClose, absence }) => {
  const [loading, setLoading] = React.useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete('/absences.php', { data: { id: absence.id } });
      onClose(true);
    } catch {
      alert('Error al eliminar la falta');
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Eliminar Falta</DialogTitle>
      <DialogContent>
        <Typography>¿Estás seguro de que deseas eliminar la falta del día {absence?.date}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={loading}>
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteAbsenceDialog;
