import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../api/axios';
import API_BASE from '../../api/config';
import notFound from '../../assets/not-found.png'; // Importa la imagen prediseñada

// Componente AttachNewDialog: diálogo para adjuntar archivos a una noticia
// Permite seleccionar y subir archivos JPG, muestra mensajes de éxito o error
// Realiza la petición a la API para adjuntar el archivo a la noticia
const AttachNewDialog = ({ open, onClose, announcement }) => {
  // Obtiene el id del anuncio
  const announcementId = announcement?.id || null;

  // Genera un timestamp para evitar caché en la imagen
  const timestamp = useMemo(() => new Date().getTime(), []);

  // URL de la imagen actual del anuncio
  const currentImageUrl = announcementId ? `${API_BASE}/announcement_photos/${announcementId}.jpg?${timestamp}` : null;

  // Estados para archivo seleccionado, vista previa, error y snackbar
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImageUrl);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Efecto para resetear vista previa y errores al abrir el diálogo
  useEffect(() => {
    setPreview(currentImageUrl);
    setSelectedFile(null);
    setError(null);
  }, [currentImageUrl, open]);

  // Maneja el cambio de archivo seleccionado y valida que sea JPG
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setError(null);

    if (file) {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        setError('Solo se permiten imágenes JPG');
        setSelectedFile(null);
        setPreview(null);
        return;
      }
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    }
  };

  // Maneja la subida del archivo seleccionado
  const handleUpload = async () => {
    if (!selectedFile || !announcementId) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('id', announcementId);

    try {
      await api.post('/upload_new_photo.php', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSnackbar({
        open: true,
        message: 'Imagen subida correctamente',
        severity: 'success',
      });

      onClose(true);
    } catch (err) {
      // Manejo de error al subir la imagen
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Error al subir la imagen',
        severity: 'error',
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => onClose(false)}>
        <DialogTitle>Subir imagen de la noticia</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={1}>
            <img
              src={preview || notFound}
              alt="Vista previa"
              style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
              onError={(e) => { e.target.src = notFound; }} // fallback si falla la carga de la imagen
            />
            <input
              type="file"
              accept="image/jpeg,image/jpg"
              onChange={handleFileChange}
            />
            <Typography variant="body2" color="textSecondary">
              Solo se aceptan archivos con formato .jpg
            </Typography>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile}
          >
            Subir
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AttachNewDialog;