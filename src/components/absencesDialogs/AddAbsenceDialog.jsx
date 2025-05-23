import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import api from '../api/axios';

const AddAbsenceDialog = ({ open, onClose, studentId, teacherId }) => {
  const [date, setDate] = useState('');
  const [justified, setJustified] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    try {
      await api.post('/absences.php', {
        student_id: studentId,
        teacher_id: teacherId,
        date,
        justified: Number(justified)
      });
      onClose(true);
    } catch {
      alert('Error al añadir la falta');
      onClose(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setDate('');
    setJustified(0);
    onClose(false);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Añadir Falta</DialogTitle>
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
        <Button onClick={handleAdd} color="primary" variant="contained" disabled={loading}>
          Añadir
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddAbsenceDialog;
