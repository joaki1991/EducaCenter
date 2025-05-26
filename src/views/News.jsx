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

function News({ onLogout }) {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attachDialogOpen, setAttachDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');
  const userRole = localStorage.getItem('EducaCenterRole');

  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  const fetchNews = () => {
    setLoading(true); // Inicia el loading
    fetch(`${API_BASE}/announcements.php`, {
      headers: {
        Authorization: localStorage.getItem('EducaCenterToken'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setNews(data);
        setLoading(false); // Termina el loading
      })
      .catch((err) => {
        console.error(err);
        setLoading(false); // Termina el loading en caso de error
      });
  };

  useEffect(() => {
    if (userRole === 'admin' || userRole === 'teacher') {
      fetchNews();
    }
  }, [userRole]);

  const handleAdd = () => {
    setSelectedNews(null);
    setAddDialogOpen(true);
  };

  const handleEdit = (item) => {
    setSelectedNews(item);
    setEditDialogOpen(true);
  };

  const handleDelete = (item) => {
    setSelectedNews(item);
    setDeleteDialogOpen(true);
  };

  const handleAttach = (item) => {
    setSelectedNews(item);
    setAttachDialogOpen(true);
  };

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
      {userRole !== 'admin' && userRole !== 'teacher' ? (
        <SidePanelLayout header={header}>
          <NewsCarousel />
        </SidePanelLayout>
      ) : (
        <SidePanelLayout header={header}>
          {/* Pasamos el estado loading a NewsPanel */}
          <NewsPanel
            news={news}
            onAdd={handleAdd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onAttach={handleAttach}
            loading={loading} // Pasamos el estado de carga
          />
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