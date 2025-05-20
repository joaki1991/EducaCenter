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

const AttachNewDialog = ({ open, onClose, announcement }) => {
  const announcementId = announcement?.id || null;

  // Guardar timestamp solo cuando cambia el announcementId para evitar que cambie cada render
  const timestamp = useMemo(() => new Date().getTime(), []);

  const currentImageUrl = announcementId ? `${API_BASE}/announcement_photos/${announcementId}.jpg?${timestamp}` : null;

  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(currentImageUrl);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    setPreview(currentImageUrl);
    setSelectedFile(null);
    setError(null);
  }, [currentImageUrl, open]);

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
      setPreview(URL.createObjectURL(file));
    }
  };

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

      onClose(true); // Cierra modal y avisa que se actualizó (para recarga)
    } catch (err) {
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
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }}
              />
            ) : (
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: 'grey.300',
                  borderRadius: 1,
                }}
              />
            )}
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