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
  MenuItem
} from '@mui/material';
import api from '../../api/axios';

const EditUserDialog = ({ open, onClose, user, onUserUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    role: '',
    password: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (user && open) {
      // Si se pasa un usuario, actualizar el formulario con los datos del usuario
      setFormData({
        name: user.name || '',
        surname: user.surname || '',
        email: user.email || '',
        role: user.role || '',
        password: user.password || '' 
      });
    }
  }, [user, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.surname.trim()) newErrors.surname = 'Los apellidos son obligatorios';
    if (!formData.role.trim()) newErrors.role = 'El rol es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: user.id,  // Usamos el id del usuario pasado como prop
      name: formData.name.trim(),
      surname: formData.surname.trim(),
      email: formData.email?.trim() || '',
      role: formData.role.trim(),      
    };
    // Solo agrega la contraseña si el campo no está vacío
    if (formData.password.trim()) {
      payload.password = formData.password;
    }

    api.put('/users.php', payload) 
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Usuario editado correctamente',
          severity: 'success'
        });

        if (typeof onUserUpdated === 'function') {
          onUserUpdated();
        }
        handleCancel();
        onClose(true); // Notifica al padre que debe recargar
      })
      .catch(err => {
        console.error('Error al editar el usuario:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar el usuario',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ name: '', surname: '', email: '', role: '', password: '' });
    setErrors({});
    onClose(false); // Solo cierra, no recarga
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Editar Usuario</DialogTitle>
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
              sx={{
                backgroundColor: '#f0f0f0',
                '& .MuiInputBase-root': {
                  backgroundColor: '#f0f0f0',
                  transition: 'background-color 0.3s ease',
                },
                '& .MuiInputBase-root.Mui-focused': {
                  backgroundColor: '#ffffff',
                }
              }}
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

export default EditUserDialog;