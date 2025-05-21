import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import API_BASE from '../../api/config';

function NewMessageDialog({ open, onClose, onMessageSent, senderId }) {
  const [recipientId, setRecipientId] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  const handleSend = async () => {
    try {
      const response = await fetch(`${API_BASE}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender_id: senderId,
          recipient_id: recipientId,
          subject,
          body,
        }),
      });

      if (!response.ok) throw new Error('Error al enviar mensaje');

      const newMessage = await response.json();
      onMessageSent(newMessage);
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
        <TextField
          autoFocus
          margin="dense"
          label="ID del destinatario"
          fullWidth
          value={recipientId}
          onChange={(e) => setRecipientId(e.target.value)}
        />
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