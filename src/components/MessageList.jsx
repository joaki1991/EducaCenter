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

function MessageList({ messages, onMessageClick }) {
  return (
    <List>
      {messages.map((msg, index) => {
        const isRead = msg.is_read === 1 || msg.is_read === true;

        return (
          <React.Fragment key={msg.id || index}>
            <ListItem
              alignItems="flex-start"
              sx={{
                backgroundColor: isRead ? 'transparent' : 'rgba(0, 0, 0, 0.04)',
                cursor: 'pointer',
              }}
              onClick={() => onMessageClick(msg)}
            >
              <ListItemAvatar>
                <Avatar>
                  <MailIcon />
                </Avatar>
              </ListItemAvatar>
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
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      fontWeight={isRead ? 'normal' : 'bold'}
                      component="span"
                      sx={{ display: 'block', marginBottom: 0.5 }}
                    >
                      {msg.body?.slice(0, 100) || 'Sin contenido'}...
                    </Typography>
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
            <Divider component="li" />
          </React.Fragment>
        );
      })}
    </List>
  );
}

export default MessageList;