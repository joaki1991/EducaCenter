import React from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

function MessageDetailDialog({ open, onClose, message }) {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Mensaje: {message?.subject || 'Sin asunto'}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">De: {message?.sender_name || message?.sender_id}</Typography>
        <Typography variant="h6">Para: {message?.receiver_name || message?.receiver_id}</Typography>
        <Typography variant="subtitle2" gutterBottom>
          Fecha: {message?.created_at}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {message?.body}
        </Typography>
      </Box>
    </Dialog>
  );
}

export default MessageDetailDialog;