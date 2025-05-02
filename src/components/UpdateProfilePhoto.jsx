import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Avatar, Box
} from '@mui/material';
import api from '../api/axios';

const UpdateProfilePhoto = ({ open, onClose, userId, currentImageUrl }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(currentImageUrl);
    const [error, setError] = useState(null); // Para manejar el mensaje de error
  
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      setSelectedFile(file);
      setError(null); // Limpiar el error al seleccionar un nuevo archivo

      // Validar que el archivo sea JPG
      if (file) {
        const fileType = file.type;
        if (fileType !== 'image/jpeg' && fileType !== 'image/jpg') {
          setError('Solo se permiten imágenes JPG');
          setSelectedFile(null); // Limpiar archivo si no es JPG
          setPreview(null); // Limpiar la vista previa
        } else {
          setPreview(URL.createObjectURL(file)); // Mostrar vista previa
        }
      }
    };
  
    const handleUpload = async () => {
      if (!selectedFile || !userId) return;
  
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('id', userId);
  
      try {
        await api.post('/upload_profile_photo.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        onClose(true); // Cierra el modal y notifica éxito
        
        // Recargar la página después de la subida exitosa
        window.location.reload(); // Recargar la página
      } catch (err) {
        console.error(err);
        setError('Error al subir la imagen');
      }
    };
  
    return (
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Cambiar imagen de perfil</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Avatar
              src={preview}
              alt="Vista previa"
              sx={{ width: 100, height: 100 }}
            />
            <input type="file" accept="image/jpeg,image/jpg" onChange={handleFileChange} />
            <Typography variant="body2" color="textSecondary">
              Solo se aceptan archivos con formato .jpg
            </Typography>
            {/* Mostrar mensaje de error si hay alguno */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleUpload} disabled={!selectedFile}>
            Subir
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  
export default UpdateProfilePhoto;