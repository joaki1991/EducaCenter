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

// Componente EditGroupDialog: diálogo para editar un grupo existente
// Permite modificar el nombre del grupo, valida campos y muestra mensajes
// Realiza la petición a la API para actualizar el grupo
const EditGroupDialog = ({ open, onClose, group }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Efecto para actualizar el formulario cuando cambia el grupo a editar
  useEffect(() => {
    if (group) {
      // Si se pasa un grupo, actualizar el formulario con los datos del grupo
      setFormData({
        name: group.name || '',        
      });
    }
  }, [group]);

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

  // Maneja el envío del formulario para actualizar el grupo
  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: group.id,
      name: formData.name.trim()
    };

    api.put('/groups.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Grupo editado correctamente',
          severity: 'success'
        });
        handleCancel();
        onClose(true); // Notifica al padre que debe recargar
      })
      .catch((err) => {
        // Manejo de error al editar grupo
        console.error('Error al editar grupo:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar grupo',
          severity: 'error'
        });
      });
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
        <DialogTitle>Editar Grupo</DialogTitle>
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

export default EditGroupDialog;