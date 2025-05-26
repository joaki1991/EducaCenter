// Lista de mensajes para la vista de mensajes
// Muestra cada mensaje con asunto, remitente y estado de leído/no leído
// Permite seleccionar un mensaje para ver su detalle
import React from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Divider,
} from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';

// Componente MessageList: muestra la lista de mensajes y permite seleccionar uno para ver su detalle
// Resalta los mensajes no leídos y muestra asunto, remitente y fecha
function MessageList({ messages, onMessageClick }) {
  return (
    <List>
      {/* Itera sobre los mensajes y renderiza cada uno */}
      {messages.map((msg, index) => {
        // Determina si el mensaje está leído o no
        const isRead = msg.is_read === 1 || msg.is_read === true;

        return (
          <React.Fragment key={msg.id || index}>
            {/* Item de mensaje con fondo diferente si no está leído */}
            <ListItem
              alignItems="flex-start"
              sx={{
                backgroundColor: isRead ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
              }}
              onClick={() => onMessageClick(msg)}
            >
              {/* Icono de mensaje */}
              <ListItemAvatar>
                <Avatar>
                  <MailIcon />
                </Avatar>
              </ListItemAvatar>
              {/* Asunto y resumen del mensaje */}
              <ListItemText
                primary={
                  <Typography
                    variant="subtitle1"
                    fontWeight={isRead ? 'normal' : 'bold'}
                    component="span"
                  >
                    {msg.subject || 'Sin asunto'}
                  </Typography>
                }
                secondary={
                  <>
                    {/* Cuerpo del mensaje (resumido) */}
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      fontWeight={isRead ? 'normal' : 'bold'}
                      component="span"
                      sx={{ display: 'block', marginBottom: 0.5 }}
                    >
                      {msg.body?.slice(0, 100) || 'Sin contenido'}...
                    </Typography>
                    {/* Remitente y fecha */}
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      component="span"
                      sx={{ display: 'block' }}
                    >
                      Enviado por: {msg.sender_name || msg.sender_id} | Fecha: {msg.created_at || '---'}
                    </Typography>
                  </>
                }
              />
            </ListItem>
            {/* Separador entre mensajes */}
            <Divider component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default MessageList;