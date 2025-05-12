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
import api from '../api/axios';

const EditGroupDialog = ({ open, onClose, groupId, onGroupUpdated }) => {
  const [formData, setFormData] = useState({
    name: ''
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (groupId) {
      // Obtener los datos del grupo al abrir el modal
      api.get(`/groups.php?id=${groupId}`)
        .then(res => {
          const group = res.data;
          setFormData({
            name: group.name || ''
          });
        })
        .catch(err => {
          console.error('Error al cargar los datos del grupo:', err);
          setSnackbar({
            open: true,
            message: 'Error al cargar los datos del grupo',
            severity: 'error'
          });
        });
    }
  }, [groupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre del grupo es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const payload = {
      id: groupId,
      name: formData.name.trim()
    };

    api.put('/groups.php', payload) // Cambié de POST a PUT aquí
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Grupo editado correctamente',
          severity: 'success'
        });

        if (typeof onGroupUpdated === 'function') {
          onGroupUpdated(); // Notifica al padre para que recargue
        }

        handleCancel(); // Limpia el formulario
      })
      .catch(err => {
        console.error('Error al editar el grupo:', err);
        setSnackbar({
          open: true,
          message: 'Error al editar el grupo',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ name: '' });
    setErrors({});
    onClose();
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