import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import api from '../../api/axios';

const EditAbsenceDialog = ({ open, onClose, absence }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    date: '',
    justified: '0'  // default 'No'
  });

  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (absence) {
      setFormData({
        student_id: absence.student_id || '',
        date: absence.date || '',
        justified: absence.justified !== undefined ? String(absence.justified) : '0'
      });
    } else {
      setFormData({ student_id: '', date: '', justified: '0' });
    }

    api.get('/students.php')
      .then((res) => {
        setStudents(res.data || []);
      })
      .catch((err) => {
        console.error('Error al obtener estudiantes:', err);
        setSnackbar({
          open: true,
          message: 'Error al obtener estudiantes',
          severity: 'error'
        });
      });
  }, [absence]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = 'Debe seleccionar un estudiante';
    if (!formData.date) newErrors.date = 'La fecha es obligatoria';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: absence.id,
      student_id: formData.student_id,
      date: formData.date,
      justified: parseInt(formData.justified, 10) // convertir a número
    };

    api.put('/absences.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Falta actualizada correctamente',
          severity: 'success'
        });
        onClose(true);
        setFormData({ student_id: '', date: '', justified: '0' });
        setErrors({});
      })
      .catch(err => {
        console.error('Error al editar la falta:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar la falta',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ student_id: '', date: '', justified: '0' });
    setErrors({});
    onClose(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Editar Falta</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <FormControl
              margin="normal"
              fullWidth
              required
              error={!!errors.student_id}
            >
              <InputLabel>Estudiante</InputLabel>
              <Select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                label="Estudiante"
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.student_id && (
                <FormHelperText>{errors.student_id}</FormHelperText>
              )}
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              name="date"
              label="Fecha de la falta"
              type="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              required
              error={!!errors.date}
              helperText={errors.date}
            />

            <FormControl
              margin="normal"
              fullWidth
              required
            >
              <InputLabel>Justificada</InputLabel>
              <Select
                name="justified"
                value={formData.justified}
                onChange={handleChange}
                label="Justificada"
              >
                <MenuItem value="1">Sí</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
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

export default EditAbsenceDialog;