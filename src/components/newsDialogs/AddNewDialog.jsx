import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../api/axios';

const AddNewDialog = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      user_id: localStorage.getItem('EducaCenterId')
    };

    api.post('/announcements.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Anuncio añadido correctamente',
          severity: 'success'
        });

        setFormData({ title: '', content: '' });
        setErrors({});
        onClose(true); // Indica que se debe actualizar la lista
      })
      .catch((err) => {
        console.error('Error al añadir anuncio:', err);
        setSnackbar({
          open: true,
          message: 'Error al añadir anuncio',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setErrors({});
    onClose(false); // No actualiza lista si se cancela
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Añadir Anuncio</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              label="Título"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              error={!!errors.title}
              helperText={errors.title}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Contenido"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              multiline
              rows={4}
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
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddNewDialog;