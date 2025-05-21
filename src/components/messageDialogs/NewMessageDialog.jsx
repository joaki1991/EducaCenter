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

function NewMessageDialog({ open, onClose, onMessageSent, senderId }) {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (open) {
      api.get('/users.php')
        .then((res) => setUsers(res.data))
        .catch((err) => console.error('Error al obtener usuarios:', err));
    }
  }, [open]);

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
      console.error(error);
      alert('No se pudo enviar el mensaje.');
    }
  };

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