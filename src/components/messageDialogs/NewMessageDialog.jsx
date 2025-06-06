import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import api from '../../api/axios';

// Componente NewMessageDialog: diálogo para enviar un nuevo mensaje
// Permite seleccionar destinatario, escribir asunto y contenido
// Valida campos obligatorios y muestra errores si faltan
// Envía el mensaje a la API y muestra un Snackbar con el resultado
function NewMessageDialog({ open, onClose, onMessageSent, senderId }) {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [users, setUsers] = useState([]);

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el Snackbar de mensajes
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  // Estado para manejar el estado de carga (loading)
  const [sending, setSending] = useState(false);

  // Carga la lista de usuarios cuando se abre el diálogo
  useEffect(() => {
    if (open) {
      api.get('/users.php')
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Error al obtener usuarios:', err));
    }
  }, [open]);

  // Valida los campos antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!recipientId) newErrors.recipientId = 'El destinatario es obligatorio';
    if (!subject.trim()) newErrors.subject = 'El asunto es obligatorio';
    if (!body.trim()) newErrors.body = 'El mensaje no puede estar vacío';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del mensaje a la API
  const handleSend = async () => {
    if (!validate()) return;

    setSending(true); // Inicia el proceso de envío (loading)

    try {
      const response = await api.post('/messages.php', {
        sender_id: senderId,
        receiver_id: recipientId,
        subject: subject.trim(),
        body: body.trim(),
      });

      setSnackbar({
        open: true,
        message: 'Mensaje enviado correctamente',
        severity: 'success',
      });

      handleClose(); // Limpia y cierra
      onMessageSent(response.data); // Notifica al padre
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setSnackbar({
        open: true,
        message: 'Error al enviar el mensaje',
        severity: 'error',
      });
    } finally {
      setSending(false);  // Finaliza el proceso de envío (loading)
    }
  };

  // Maneja el cierre y reseteo del diálogo
  const handleClose = () => {
    setRecipientId('');
    setSubject('');
    setBody('');
    setErrors({});
    onClose(); // Solo cierra
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Nuevo Mensaje</DialogTitle>
        <DialogContent>
          {/* Selector del destinatario */}
          <FormControl fullWidth margin="dense" required error={!!errors.recipientId}>
            <InputLabel id="recipient-label">Destinatario</InputLabel>
            <Select
              labelId="recipient-label"
              value={recipientId}
              label="Destinatario"
              onChange={(e) => setRecipientId(e.target.value)}
            >
              {users
                .filter((user) => user.id !== Number(senderId))
                .map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name} {user.surname}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {errors.recipientId && (
            <Box mt={0.5} ml={1} color="error.main" fontSize="0.75rem">
              {errors.recipientId}
            </Box>
          )}

          {/* Campo de asunto */}
          <TextField
            margin="dense"
            fullWidth
            label="Asunto"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            error={!!errors.subject}
            helperText={errors.subject}
          />

          {/* Campo de contenido del mensaje */}
          <TextField
            margin="dense"
            fullWidth
            multiline
            rows={4}
            label="Mensaje"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            error={!!errors.body}
            helperText={errors.body}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} disabled={sending}>Cancelar</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSend}
            disabled={sending}  // Deshabilita el botón mientras se está enviando el mensaje
            startIcon={sending ? <CircularProgress size={20} color="inherit" /> : null} // Muestra el spinner mientras se envía
          >
            {sending ? 'Enviando...' : 'Enviar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar para mensajes de éxito o error */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}>
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default NewMessageDialog;