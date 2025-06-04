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
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../../api/axios';

// Componente AddNewDialog: diálogo para agregar una nueva noticia
// Permite ingresar título y contenido, valida campos y muestra mensajes
// Realiza la petición a la API para crear la noticia
const AddNewDialog = ({ open, onClose }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  // Estado para manejar el estado de carga (loading)
  const [sending, setSending] = useState(false);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Valida los campos antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'El título es obligatorio';
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para crear la noticia
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      user_id: localStorage.getItem('EducaCenterId')
    };

    setSending(true); // Inicia el proceso de envío (loading)

    try {
      await api.post('/announcements.php', payload);

      setSnackbar({
        open: true,
        message: 'Anuncio añadido correctamente',
        severity: 'success'
      });

      // Limpia el formulario y cierra el diálogo
      setFormData({ title: '', content: '' });
      setErrors({});
      onClose(true); // Indica que se debe actualizar la lista
    } catch (err) {
      // Manejo de error al añadir anuncio
      console.error('Error al añadir anuncio:', err);
      setSnackbar({
        open: true,
        message: 'Error al añadir anuncio',
        severity: 'error'
      });
    } finally {
      setSending(false); // Finaliza el proceso de envío (loading)
    }
  };

  // Maneja la cancelación y reseteo del formulario
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
          <Button onClick={handleCancel} disabled={sending}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={sending} // Deshabilita el botón mientras se está enviando
            startIcon={sending ? <CircularProgress size={20} color="inherit" /> : null} // Muestra el spinner mientras se está enviando
          >
            {sending ? 'Enviando...' : 'Guardar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de éxito o error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddNewDialog;