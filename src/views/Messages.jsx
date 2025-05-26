// Vista de mensajes
// Permite ver mensajes recibidos/enviados, crear nuevos y ver detalles
// Incluye tabs, panel de mensajes y diálogos de gestión

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
import api from '../api/axios'; 
import API_BASE from '../api/config';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import MessageList from '../components/MessageList';
import NewMessageDialog from '../components/messageDialogs/NewMessageDialog';
import MessageDetailDialog from '../components/messageDialogs/MessageDetailDialog';

function Messages({ onLogout }) {
  // Controla la apertura del diálogo de foto de perfil
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  // Controla la pestaña activa (0: entrada, 1: salida)
  const [tab, setTab] = useState(0);
  // Lista de mensajes
  const [messages, setMessages] = useState([]);
  // Controla la apertura del diálogo para nuevo mensaje
  const [newMessageOpen, setNewMessageOpen] = useState(false);
  // Mensaje seleccionado para ver detalle
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Obtiene datos del usuario logueado
  const user = localStorage.getItem('EducaCenterUser');
  const userId = Number(localStorage.getItem('EducaCenterId'));

  // Cabecera personalizada
  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  // Obtiene los mensajes desde la API
  const fetchMessages = async () => {
    try {
      const response = await api.get('/messages.php');
      setMessages(response.data);
    } catch (error) {
      console.error('Error cargando mensajes:', error);
    }
  };

  // Carga los mensajes al montar el componente
  useEffect(() => {
    fetchMessages();
  }, []);

  // Maneja el cierre del diálogo de detalle de mensaje y marca como leído si corresponde
  const handleCloseMessageDialog = async () => {
    if (selectedMessage && selectedMessage.is_read !== 1 && selectedMessage.receiver_id === userId) {
      try {
        await api.put('/messages.php', {
          id: selectedMessage.id,
          is_read: 1,
        });
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
    window.location.reload(); // Recargar la página para reflejar cambios
  };

  // Filtra los mensajes según la pestaña activa
  const filteredMessages = messages.filter((msg) =>
    tab === 0
      ? msg.receiver_id === userId // Entrada
      : msg.sender_id === userId   // Salida
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
        onMessageSent={async () => {
          // En vez de sólo añadir el mensaje nuevo, recargamos la lista entera
          await fetchMessages();
          setNewMessageOpen(false);
        }}
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