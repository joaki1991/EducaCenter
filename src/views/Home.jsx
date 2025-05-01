import React from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import NewsCarousel from '../components/NewsCarousel';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';

function Home({ onLogout }) {
  const user = localStorage.getItem('EducaCenterUser');
  const header = (
    <Header
      userName= {user ? user : 'Usuario'}
      userImage= {API_BASE+'/profile_photo/'+user+'.jpg'}
      onLogout={onLogout}
      onMessages={() => console.log('Messages')}
      logoImage={logo}
    />
  );

  return (
    <Box
    sx={{     
      minHeight: '100vh',
      width: '100%',
      backgroundImage: `url(${fondo})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',      
    }}
  >    <SidePanelLayout header={header}>   
        <NewsCarousel />     
      </SidePanelLayout>
    </Box>
  );
}

export default Home;