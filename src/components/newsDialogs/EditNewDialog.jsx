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
  Alert
} from '@mui/material';
import api from '../../api/axios';

// Componente EditNewDialog: diálogo para editar una noticia existente
// Permite modificar título y contenido, valida campos y muestra mensajes
// Realiza la petición a la API para actualizar la noticia
const EditNewDialog = ({ open, onClose, announcement }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Efecto para actualizar el formulario cuando cambia el anuncio a editar
  useEffect(() => {
    if (announcement) {
      setFormData({
        title: announcement.title || '',
        content: announcement.content || ''
      });
    } else {
      // Limpiar formulario si no hay anuncio
      setFormData({ title: '', content: '' });
    }
  }, [announcement]);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Valida los campos antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para actualizar la noticia
  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: announcement.id,
      title: formData.title.trim(),
      content: formData.content.trim()
    };

    api.put('/announcements.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Anuncio editado correctamente',
          severity: 'success'
        });
        // Aquí indicamos que hubo actualización
        onClose(true);
        setFormData({ title: '', content: '' });
        setErrors({});
      })
      .catch(err => {
        // Manejo de error al editar el anuncio
        console.error('Error al editar el anuncio:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar el anuncio',
          severity: 'error'
        });
      });
  };

  // Maneja la cancelación y reseteo del formulario
  const handleCancel = () => {
    setFormData({ title: '', content: '' });
    setErrors({});
    onClose(false); // Aquí le pasamos false para indicar que no hubo actualización si lo usas así
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Editar Anuncio</DialogTitle>
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

export default EditNewDialog;