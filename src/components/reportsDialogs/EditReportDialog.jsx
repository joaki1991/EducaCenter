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

const EditReportDialog = ({ open, onClose, report }) => {
  const [formData, setFormData] = useState({
    student_id: '',
    content: ''
  });

  const [students, setStudents] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (report) {
      setFormData({
        student_id: report.student_id || '',
        content: report.content || ''
      });
    } else {
      setFormData({ student_id: '', content: '' });
    }

    // Cargar lista de estudiantes
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
  }, [report]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = 'Debe seleccionar un estudiante';
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: report.id,
      student_id: formData.student_id,
      content: formData.content.trim()
    };

    api.put('/reports.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Informe actualizado correctamente',
          severity: 'success'
        });
        onClose(true); // actualización exitosa
        setFormData({ student_id: '', content: '' });
        setErrors({});
      })
      .catch(err => {
        console.error('Error al editar el informe:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar el informe',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ student_id: '', content: '' });
    setErrors({});
    onClose(false); // cancelado
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Editar Informe</DialogTitle>
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
              multiline
              rows={4}
              label="Contenido"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              error={!!errors.content}
              helperText={errors.content}
            />
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

export default EditReportDialog;