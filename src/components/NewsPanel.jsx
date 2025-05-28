// Panel para mostrar y gestionar la lista de noticias
// Permite agregar, editar, eliminar y adjuntar archivos a noticias
// Muestra una tabla con los datos y botones de acción
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
        {/* Si se está cargando, mostramos el Skeleton solo en las celdas */}
        {loading ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Título</TableCell>
                <TableCell>Autor</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {/* Añadimos Skeleton para las filas simulando la carga */}
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" width="80%" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width="60%" />
                  </TableCell>
                  <TableCell align="center" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Skeleton variant="rectangular" width={80} height={36} />
                    <Skeleton variant="rectangular" width={80} height={36} />
                    <Skeleton variant="rectangular" width={80} height={36} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          // Si no está cargando, mostramos la tabla real con los datos
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