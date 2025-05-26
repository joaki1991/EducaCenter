import React from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton
} from '@mui/material';
import { Edit, Delete, Image as ImageIcon } from '@mui/icons-material';

const NewsPanel = ({ news, onAdd, onEdit, onDelete, onAttach, loading }) => {
  return (
    <Box p={2}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Gestión de Noticias</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={onAdd}
        >
          Añadir Noticia
        </Button>
      </Box>

      <TableContainer component={Paper}>
        {/* Si se está cargando, mostramos el Skeleton */}
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={400} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Autor</TableCell>
                  <TableCell align="center">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Añadimos Skeleton para las filas */}
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="text" width="60%" />
                    </TableCell>
                    <TableCell align="center">
                      <Skeleton variant="rectangular" width={80} height={40} />
                      <Skeleton variant="rectangular" width={80} height={40} sx={{ mt: 1 }} />
                      <Skeleton variant="rectangular" width={80} height={40} sx={{ mt: 1 }} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Skeleton>
        ) : (
          // Si no está cargando, mostramos la tabla real
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {news.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.author || '-'}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => onEdit(item)}
                      startIcon={<Edit />}
                      sx={{ mr: 1 }}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete(item)}
                      startIcon={<Delete />}
                      sx={{ mr: 1 }}
                    >
                      Eliminar
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      size="small"
                      onClick={() => onAttach(item)}
                      startIcon={<ImageIcon />}
                    >
                      Adjuntar Foto
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default NewsPanel;