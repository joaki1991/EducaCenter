import React, { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  Fab,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Header from '../components/Header';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import MessageList from '../components/MessageList';
import NewMessageDialog from '../components/messageDialogs/NewMessageDialog';
import MessageDetailDialog from '../components/messageDialogs/MessageDetailDialog';

function Messages({ onLogout }) {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [messages, setMessages] = useState([]);
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');

  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      onMessages={() => console.log('Messages')}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  const handleCloseMessageDialog = async () => {
    if (selectedMessage && selectedMessage.is_read !== 1) {
      try {
        await fetch(`${API_BASE}/messages.php`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: selectedMessage.id, is_read: 1 }),
        });
  
        // Marca el mensaje como leído localmente
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === selectedMessage.id ? { ...msg, is_read: 1 } : msg
          )
        );
      } catch (error) {
        console.error('Error al actualizar is_read:', error);
      }
    }
  
    setSelectedMessage(null);
  };

  useEffect(() => {
    async function fetchMessages() {
      try {
        const response = await fetch(`${API_BASE}/messages`);
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error('Error cargando mensajes:', error);
      }
    }

    fetchMessages();
  }, []);

  const filteredMessages = messages.filter((msg) =>
    tab === 0 ? msg.sender_id !== userId : msg.sender_id === userId
  );

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      <SidePanelLayout header={header}>
        <Box sx={{ padding: 2 }}>
          <Tabs
            value={tab}
            onChange={(e, newValue) => setTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Entrada" />
            <Tab label="Salida" />
          </Tabs>

          <Box sx={{ marginTop: 2 }}>
            {filteredMessages.length > 0 ? (
              <MessageList
                messages={filteredMessages}
                onMessageClick={(msg) => setSelectedMessage(msg)}
              />
            ) : (
              <Typography variant="body1">
                No hay mensajes para mostrar.
              </Typography>
            )}
          </Box>
        </Box>
      </SidePanelLayout>

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setNewMessageOpen(true)}
        sx={{ position: 'fixed', bottom: 32, right: 32 }}
      >
        <AddIcon />
      </Fab>

      <MessageDetailDialog
        open={!!selectedMessage}
        onClose={handleCloseMessageDialog}
        message={selectedMessage}
      />
      
      <NewMessageDialog
        open={newMessageOpen}
        onClose={() => setNewMessageOpen(false)}
        onMessageSent={(newMsg) => setMessages((prev) => [...prev, newMsg])}
        senderId={userId}
      />

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

export default Messages;