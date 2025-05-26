// Diálogo para cambiar la contraseña del usuario
// Permite ingresar la contraseña actual y la nueva, mostrando mensajes de error o éxito
// Realiza la petición a la API para actualizar la contraseña
import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../api/axios'; 

// Componente NewPasswordDialog: diálogo para cambiar la contraseña del usuario
// Permite ingresar la contraseña actual y la nueva, mostrando mensajes de error o éxito
// Realiza la petición a la API para actualizar la contraseña
const NewPasswordDialog = ({ open, onClose, userId }) => {
  // Estados locales para los campos y visibilidad de contraseñas
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Maneja el guardado de la nueva contraseña
  const handleSave = async () => {
    setLoading(true);
    try {
      // Llama a la API para actualizar la contraseña
      const response = await api.post('/updatePassword.php', {
        id: userId,
        old_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data.success) {
        // Si es exitoso, muestra mensaje y limpia campos
        setSuccessMessage('Contraseña actualizada correctamente');
        setErrorMessage('');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          setSuccessMessage('');
          handleClose();
        }, 1500); // Deja 1,5 segundos para mostrar el mensaje de éxito
      } else {
        // Si hay error, muestra mensaje de error
        setErrorMessage(response.data.error || 'Error al actualizar la contraseña');
        setSuccessMessage('');
      }
    } catch (error) {
      // Manejo de error de red o servidor
      setErrorMessage(
        error.response?.data?.error || 'No se pudo conectar con el servidor'
      );
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  // Limpia los campos y cierra el diálogo
  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(false);
    onClose();
  };

  // Alterna la visibilidad de la contraseña actual
  const toggleShowCurrent = () => setShowCurrent((prev) => !prev);
  // Alterna la visibilidad de la nueva contraseña
  const toggleShowNew = () => setShowNew((prev) => !prev);

  // Render principal del diálogo de cambio de contraseña
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Actualizar Contraseña</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Typography variant="body2">
            Introduce tu contraseña actual y la nueva
          </Typography>
          {/* Campo para la contraseña actual */}
          <TextField
            type={showCurrent ? 'text' : 'password'}
            label="Contraseña actual"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowCurrent} edge="end">
                    {showCurrent ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Campo para la nueva contraseña */}
          <TextField
            type={showNew ? 'text' : 'password'}
            label="Nueva contraseña"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={toggleShowNew} edge="end">
                    {showNew ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {/* Mensaje de error si existe */}
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
          {/* Mensaje de éxito si existe */}
          {successMessage && (
            <Typography sx={{ color: 'green' }} variant="body2">
              {successMessage}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Cancelar
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          color={loading ? 'inherit' : 'primary'}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NewPasswordDialog;