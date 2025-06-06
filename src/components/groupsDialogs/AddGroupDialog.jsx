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

// Componente AddGroupDialog: diálogo para agregar un nuevo grupo
// Permite ingresar el nombre del grupo, valida campos y muestra mensajes
// Realiza la petición a la API para crear el grupo
const AddGroupDialog = ({ open, onClose }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Estado para controlar el estado de carga de la creación
  const [saving, setSaving] = useState(false);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Valida el campo nombre antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del grupo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para crear el grupo
  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true); // Comienza la operación de guardado

    const payload = {
      name: formData.name.trim(),
    };

    try {
      await api.post('/groups.php', payload);
      setSnackbar({
        open: true,
        message: 'Grupo añadido correctamente',
        severity: 'success'
      });
      handleCancel();
      onClose(true); // Notifica al padre que debe recargar
    } catch (err) {
      console.error('Error al añadir grupo:', err);
      setSnackbar({
        open: true,
        message: 'Error al añadir grupo',
        severity: 'error'
      });
    } finally {
      setSaving(false); // Termina la operación de guardado
    }
  };

  // Maneja la cancelación y reseteo del formulario
  const handleCancel = () => {
    setFormData({ name: '' });
    setErrors({});
    onClose(false); // Solo cierra, no recarga
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Añadir Grupo</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre del Grupo"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} disabled={saving}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={saving} // Deshabilita si está guardando
            startIcon={saving ? <CircularProgress size={20} /> : null}
          >
            {saving ? 'Guardando...' : 'Guardar'}
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

export default AddGroupDialog;