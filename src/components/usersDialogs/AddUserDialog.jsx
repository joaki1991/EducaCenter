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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import api from '../../api/axios';

// Componente AddUserDialog: diálogo para agregar un nuevo usuario
// Permite ingresar datos básicos y rol, valida campos y muestra mensajes
// Realiza la petición a la API para crear el usuario
const AddUserDialog = ({ open, onClose }) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: '',
    password: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Valida los campos antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.surname.trim()) newErrors.surname = 'Los apellidos son obligatorios';
    if (!formData.role.trim()) newErrors.role = 'El rol es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para crear el usuario
  const handleSubmit = () => {
    if (!validate()) return;
  
    const payload = {
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      email: formData.email?.trim() || '',
      role: formData.role.trim(),
      password: formData.password || ''
    };
  
    api.post('/users.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Usuario añadido correctamente',
          severity: 'success'
        });               
  
        handleCancel(); // Limpia el formulario
        onClose(true); // Notifica al padre que debe recargar
      })
      .catch(err => {
        // Manejo de error al añadir usuario
        console.error('Error al añadir usuario:', err);
        setSnackbar({
          open: true,
          message: 'Error al añadir usuario',
          severity: 'error'
        });
      });
  };

  // Maneja la cancelación y reseteo del formulario
  const handleCancel = () => {
    setFormData({ name: '', surname: '', email: '', role: '', password: '' });
    setErrors({});
    onClose(false); // Solo cierra, no recarga
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Añadir Usuario</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <TextField
              margin="normal"
              fullWidth
              label="Nombre"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Apellidos"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
              error={!!errors.surname}
              helperText={errors.surname}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal" required error={!!errors.role}>
              <InputLabel id="role-label">Rol</InputLabel>
              <Select
                labelId="role-label"
                name="role"
                value={formData.role}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="admin">Administrador</MenuItem>
                <MenuItem value="teacher">Profesor</MenuItem>
                <MenuItem value="student">Estudiante</MenuItem>
                <MenuItem value="parent">Padre/Madre</MenuItem>
              </Select>
            </FormControl>
            {errors.role && (
              <Box mt={0.5} ml={1} color="error.main" fontSize="0.75rem">
                {errors.role}
              </Box>
            )}

            <TextField
              margin="normal"
              fullWidth
              label="Contraseña"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
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

export default AddUserDialog;