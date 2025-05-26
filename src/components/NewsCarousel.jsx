// Carrusel de noticias para la vista principal y noticias
// Permite navegar entre noticias, ver contenido completo y muestra estado de carga
// Carga las noticias desde la API al montar el componente
import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress, Button } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import api from '../api/axios'; 
import API_BASE from '../api/config'; 
import notFound from '../assets/not-found.png'; // Ruta de la imagen prediseñada

const NewsCarousel = () => {
  const [news, setNews] = useState([]); // Lista de noticias
  const [currentIndex, setCurrentIndex] = useState(0); // Índice actual del carrusel
  const [loading, setLoading] = useState(true); // Estado de carga
  const [showFullContent, setShowFullContent] = useState(false); // Estado para mostrar u ocultar el contenido completo

  useEffect(() => {
    // Cargar noticias desde la API al montar el componente
    api.get('/announcements.php') // Asegúrate de que esta ruta coincida con tu endpoint de noticias
      .then((res) => {
        setNews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error al cargar noticias:', err);
        setLoading(false);
      });
  }, []);

  // Ir a la siguiente noticia y resetear el contenido mostrado
  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
    setShowFullContent(false); // Ocultar contenido completo al cambiar de noticia
  };

  // Ir a la noticia anterior y resetear el contenido mostrado
  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
    setShowFullContent(false); // Ocultar contenido completo al cambiar de noticia
  };

  // Alternar entre mostrar y ocultar el contenido completo
  const toggleContent = () => {
    setShowFullContent((prev) => !prev);
  };

  // Mostrar indicador de carga mientras se obtienen los datos
  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar mensaje si no hay noticias
  if (news.length === 0) {
    return <Typography textAlign="center" mt={4}>No hay noticias disponibles.</Typography>;
  }

  // Obtener la noticia actual según el índice
  const currentNews = news[currentIndex];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mt: 4,
        px: 2,
      }}
    >
      {/* Botón para ir a la noticia anterior */}
      <IconButton onClick={handlePrev}>
        <ArrowBackIos />
      </IconButton>

      <Box
        sx={{
          width: '100%',
          maxWidth: 600,
          textAlign: 'center',
          borderRadius: 4,
          boxShadow: 3,
          p: 2,
          backgroundColor: '#fff',
        }}
      >
        {/* Imagen de la noticia con fallback a imagen prediseñada */}
        <img
          src={API_BASE + '/announcements_photo/' + currentNews.id + '.jpg'}
          alt={currentNews.title}
          style={{ width: '100%', borderRadius: '8px' }}
          onError={(e) => {
            e.target.onerror = null; // Previene un bucle si la imagen predeterminada también falla
            e.target.src = notFound; // Ruta de imagen prediseñada
          }}
        />

        {/* Título de la noticia */}
        <Typography variant="h6" mt={2}>
          {currentNews.title}
        </Typography>

        {/* Mostrar contenido completo o no dependiendo del estado */}
        <Typography variant="body2" mt={2}>
          {showFullContent && currentNews.content}
        </Typography>

        {/* Botón para alternar entre mostrar más u ocultar */}
        <Button
          onClick={toggleContent}
          sx={{ mt: 2 }}
          variant="text"
          color="primary"
        >
          {showFullContent ? 'Ocultar' : 'Leer más'}
        </Button>
      </Box>

      {/* Botón para ir a la siguiente noticia */}
      <IconButton onClick={handleNext}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default NewsCarousel;