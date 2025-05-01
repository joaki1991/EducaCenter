import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import api from '../api/axios'; 
import API_BASE from '../api/config'; 

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % news.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);
  };

  if (loading) {
    return (
      <Box textAlign="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (news.length === 0) {
    return <Typography textAlign="center" mt={4}>No hay noticias disponibles.</Typography>;
  }

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
        <img
          src={API_BASE+'/announcements_photo/'+currentNews.id+'.jpg'}
          alt={currentNews.title}
          style={{ width: '100%', borderRadius: '8px' }}
        />
        <Typography variant="h6" mt={2}>
          {currentNews.title}
        </Typography>
      </Box>

      <IconButton onClick={handleNext}>
        <ArrowForwardIos />
      </IconButton>
    </Box>
  );
};

export default NewsCarousel;