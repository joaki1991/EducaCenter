import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, IconButton, InputAdornment, CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../api/axios'; 

const NewPasswordDialog = ({ open, onClose, userId }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.post('/updatePassword.php', {
        id: userId,
        old_password: currentPassword,
        new_password: newPassword,
      });

      if (response.data.success) {
        setSuccessMessage('Contraseña actualizada correctamente');
        setErrorMessage('');
        setCurrentPassword('');
        setNewPassword('');
        setTimeout(() => {
          setSuccessMessage('');
          handleClose();
        }, 1500); // Dejo 1,5 segundos para que el usuario vea el mensaje de éxito
      } else {
        setErrorMessage(response.data.error || 'Error al actualizar la contraseña');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'No se pudo conectar con el servidor'
      );
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCurrentPassword('');
    setNewPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(false);
    onClose();
  };

  const toggleShowCurrent = () => setShowCurrent((prev) => !prev);
  const toggleShowNew = () => setShowNew((prev) => !prev);

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Actualizar Contraseña</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <Typography variant="body2">
            Introduce tu contraseña actual y la nueva
          </Typography>
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
          {errorMessage && (
            <Typography color="error" variant="body2">
              {errorMessage}
            </Typography>
          )}
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