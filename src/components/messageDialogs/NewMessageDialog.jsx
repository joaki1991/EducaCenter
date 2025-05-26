import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import api from '../../api/axios'; 

// Componente NewMessageDialog: diálogo para crear y enviar un nuevo mensaje
// Permite seleccionar destinatario, asunto y contenido, valida campos y muestra mensajes
// Realiza la petición a la API para enviar el mensaje
function NewMessageDialog({ open, onClose, onMessageSent, senderId }) {
  // Estados para los campos del formulario y la lista de usuarios
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [users, setUsers] = useState([]);

  // Efecto para cargar la lista de usuarios al abrir el diálogo
  useEffect(() => {
    if (open) {
      api.get('/users.php')
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Error al obtener usuarios:', err));
    }
  }, [open]);

  // Maneja el envío del mensaje
  const handleSend = async () => {
    try {
      const response = await api.post('/messages.php', {
        sender_id: senderId,
        receiver_id: recipientId,
        subject,
        body,
      });

      onMessageSent(response.data); // Pasas el mensaje recién creado
      handleClose();
    } catch (error) {
      // Manejo de error al enviar el mensaje
      console.error(error);
      alert('No se pudo enviar el mensaje.');
    }
  };

  // Limpia los campos y cierra el diálogo
  const handleClose = () => {
    setRecipientId('');
    setSubject('');
    setBody('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Nuevo Mensaje</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="dense">
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

        <TextField
          margin="dense"
          label="Asunto"
          fullWidth
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Mensaje"
          fullWidth
          multiline
          rows={4}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSend} variant="contained">
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default NewMessageDialog;