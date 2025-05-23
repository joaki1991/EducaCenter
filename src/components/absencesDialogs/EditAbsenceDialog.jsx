import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import api from '../api/axios';

const EditAbsenceDialog = ({ open, onClose, absence }) => {
  const [date, setDate] = useState('');
  const [justified, setJustified] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (absence) {
      setDate(absence.date || '');
      setJustified(absence.justified ? 1 : 0);
    }
  }, [absence]);

  const handleEdit = async () => {
    setLoading(true);
    try {
      await api.put('/absences.php', {
        id: absence.id,
        date,
        justified: Number(justified)
      });
      onClose(true);
    } catch {
      alert('Error al editar la falta');
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
      <DialogTitle>Editar Falta</DialogTitle>
      <DialogContent>
        <TextField
          margin="dense"
          label="Fecha"
          type="date"
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={e => setDate(e.target.value)}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel id="justified-label">Justificada</InputLabel>
          <Select
            labelId="justified-label"
            value={justified}
            label="Justificada"
            onChange={e => setJustified(e.target.value)}
          >
            <MenuItem value={1}>Sí</MenuItem>
            <MenuItem value={0}>No</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancelar</Button>
        <Button onClick={handleEdit} color="primary" variant="contained" disabled={loading}>
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditAbsenceDialog;
