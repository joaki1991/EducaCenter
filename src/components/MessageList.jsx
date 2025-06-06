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
  Skeleton,
  Box,
} from '@mui/material';
import MailIcon from '@mui/icons-material/MailOutline';

// Componente MessageList: muestra la lista de mensajes y permite seleccionar uno para ver su detalle
// Resalta los mensajes no leídos y muestra asunto, remitente y fecha
// Incluye un skeleton mientras se cargan los mensajes
function MessageList({ messages, onMessageClick, loading = false }) {
  // Crea un arreglo de placeholders para mostrar skeletons
  const skeletonArray = Array.from({ length: 5 });

  return (
    <List>
      {/* Si está cargando, muestra los skeletons en lugar de los mensajes reales */}
      {loading ? (
        skeletonArray.map((_, index) => (
          <React.Fragment key={index}>
            <ListItem alignItems="flex-start">
              {/* Skeleton para el avatar del mensaje */}
              <ListItemAvatar>
                <Skeleton variant="circular" width={40} height={40} />
              </ListItemAvatar>
              {/* Skeletons para el texto del mensaje */}
              <ListItemText
                disableTypography // Previene el envoltorio automático en <p>
                primary={<Skeleton variant="text" width="80%" />}
                secondary={
                  <Box>
                    <Skeleton variant="text" width="90%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                }
              />
            </ListItem>
            {/* Separador entre skeletons */}
            <Divider component="li" />
          </React.Fragment>
        ))
      ) : (
        // Itera sobre los mensajes y renderiza cada uno
        messages.map((msg, index) => {
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
                  disableTypography // Control total sobre la semántica para evitar errores HTML
                  primary={
                    <Typography
                      variant="subtitle1"
                      fontWeight={isRead ? 'normal' : 'bold'}
                      component="div"
                    >
                      {msg.subject || 'Sin asunto'}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      {/* Cuerpo del mensaje (resumido) */}
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        fontWeight={isRead ? 'normal' : 'bold'}
                        component="div"
                        sx={{ marginBottom: 0.5 }}
                      >
                        {msg.body?.slice(0, 100) || 'Sin contenido'}...
                      </Typography>
                      {/* Remitente y fecha */}
                      <Typography
                        variant="caption"
                        color="textSecondary"
                        component="div"
                      >
                        Enviado por: {msg.sender_name || msg.sender_id} | Fecha: {msg.created_at || '---'}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {/* Separador entre mensajes */}
              <Divider component="li" />
            </React.Fragment>
          );
        })
      )}
    </List>
  );
}

export default MessageList;