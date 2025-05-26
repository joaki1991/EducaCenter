// Vista de noticias: muestra y gestiona anuncios/noticias según el rol
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import NewsCarousel from '../components/NewsCarousel';
import NewsPanel from '../components/NewsPanel';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import AddNewDialog from '../components/newsDialogs/AddNewDialog';
import EditNewDialog from '../components/newsDialogs/EditNewDialog';
import DeleteNewDialog from '../components/newsDialogs/DeleteNewDialog';
import AttachNewDialog from '../components/newsDialogs/AttachNewDialog';

/**
 * Vista de noticias
 * Muestra el carrusel de noticias y panel de gestión según el rol
 * Permite agregar, editar, eliminar y adjuntar noticias si el usuario es admin o teacher
 */

function News({ onLogout }) {
  // Controla la apertura del diálogo de foto de perfil
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  // Controla la apertura del diálogo para agregar noticia
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // Controla la apertura del diálogo para editar noticia
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // Controla la apertura del diálogo para eliminar noticia
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // Controla la apertura del diálogo para adjuntar archivos a noticia
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  // Noticia seleccionada para editar, eliminar o adjuntar
  const [selectedNews, setSelectedNews] = useState(null);
  // Lista de noticias
  const [news, setNews] = useState([]);
  // Estado de carga
  const [loading, setLoading] = useState(true);

  // Obtiene datos del usuario logueado
  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');
  const userRole = localStorage.getItem('EducaCenterRole');

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

  // Obtiene las noticias desde la API
  const fetchNews = () => {
    setLoading(true);
    fetch(`${API_BASE}/announcements.php`, {
      headers: {
        Authorization: localStorage.getItem('EducaCenterToken'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  // useEffect: carga las noticias si el usuario es admin o teacher
  useEffect(() => {
    if (userRole === 'admin' || userRole === 'teacher') {
      fetchNews();
    }
  }, [userRole]);

  // handleAdd: abre el diálogo para agregar una nueva noticia
  const handleAdd = () => {
    setSelectedNews(null);
    setAddDialogOpen(true);
  };

  // handleEdit: abre el diálogo para editar la noticia seleccionada
  const handleEdit = (item) => {
    setSelectedNews(item);
    setEditDialogOpen(true);
  };

  // handleDelete: abre el diálogo para eliminar la noticia seleccionada
  const handleDelete = (item) => {
    setSelectedNews(item);
    setDeleteDialogOpen(true);
  };

  // handleAttach: abre el diálogo para adjuntar archivos a la noticia seleccionada
  const handleAttach = (item) => {
    setSelectedNews(item);
    setAttachDialogOpen(true);
  };

  // Renderizado principal: muestra el carrusel o el panel de gestión según el rol
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Si el usuario NO es admin ni teacher, solo ve el carrusel de noticias */}
      {userRole !== 'admin' && userRole !== 'teacher' ? (
        <SidePanelLayout header={header}>
          <NewsCarousel />
        </SidePanelLayout>
      ) : (
        // Si es admin o teacher, ve el panel de gestión de noticias
        <SidePanelLayout header={header}>
          {!loading && (
            <NewsPanel
              news={news}
              onAdd={handleAdd}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAttach={handleAttach}
            />
          )}
        </SidePanelLayout>
      )}

      {/* Configuración y foto */}

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />

      {/* Diálogos para gestión de anuncios */}
      {userRole === 'admin' || userRole === 'teacher' ? (
        <>
          <AddNewDialog
            open={addDialogOpen}
            onClose={(updated) => {
              setAddDialogOpen(false);
              if (updated) fetchNews();
            }}
          />
          <EditNewDialog
            open={editDialogOpen}
            announcement={selectedNews}
            onClose={(updated) => {
              setEditDialogOpen(false);
              if (updated) fetchNews();
            }}
          />
          <DeleteNewDialog
            open={deleteDialogOpen}
            announcement={selectedNews}
            onClose={(updated) => {
              setDeleteDialogOpen(false);
              if (updated) fetchNews();
            }}
          />
          <AttachNewDialog
            open={attachDialogOpen}
            announcement={selectedNews}
            onClose={(updated) => {
              setAttachDialogOpen(false);
              if (updated) fetchNews();
            }}
          />
        </>
      ) : null}
    </Box>
  );
}

export default News;