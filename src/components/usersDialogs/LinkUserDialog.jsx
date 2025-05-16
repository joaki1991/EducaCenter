import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import api from '../../api/axios';

const LinkUserDialog = ({ open, onClose, user, onUserLinked }) => {
  const [groups, setGroups] = useState([]);
  const [parents, setParents] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [selectedParent, setSelectedParent] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (open) {
      setLoading(true);
      // Cargar los grupos
      api.get('/groups.php')
        .then(res => {
          if (Array.isArray(res.data)) {
            setGroups(res.data);
          } else {
            console.warn('No se pudieron cargar los grupos');
            setGroups([]);
          }
        })
        .catch(err => {
          console.error('Error al cargar grupos:', err);
          setGroups([]);
        });

      // Cargar los padres solo si el usuario es un estudiante
      if (user.role === 'student') {
        api.get('/parents.php')
          .then(res => {
            if (Array.isArray(res.data)) {
              setParents(res.data);
            } else {
              console.warn('No se pudieron cargar los padres');
              setParents([]);
            }
          })
          .catch(err => {
            console.error('Error al cargar los padres:', err);
            setParents([]);
          });
      }

      setLoading(false);
    }
  }, [open, user]);

  const handleSave = () => {
    if (user.role === 'teacher' && selectedGroup) {
      // Vincular al grupo para el teacher
      api.put('/groups.php', { userId: user.id, groupId: selectedGroup })
        .then(() => {
          setSnackbar({
            open: true,
            message: 'Profesor vinculado al grupo correctamente',
            severity: 'success'
          });
          onUserLinked(); // Notifica al padre para recargar usuarios o actualizar la lista de grupos
          onClose();
        })
        .catch(err => {
          console.error('Error al vincular el profesor:', err);
          setSnackbar({
            open: true,
            message: 'Error al vincular al grupo',
            severity: 'error'
          });
        });
    } else if (user.role === 'student' && (selectedGroup || selectedParent)) {
      // Vincular al grupo y al padre para el student
      api.put('/groups.php', { userId: user.id, groupId: selectedGroup, parentId: selectedParent })
        .then(() => {
          setSnackbar({
            open: true,
            message: 'Estudiante vinculado correctamente',
            severity: 'success'
          });
          onUserLinked();
          onClose();
        })
        .catch(err => {
          console.error('Error al vincular al estudiante:', err);
          setSnackbar({
            open: true,
            message: 'Error al vincular al grupo y al padre',
            severity: 'error'
          });
        });
    } else {
      setSnackbar({
        open: true,
        message: 'Debe seleccionar un grupo o un padre (si es estudiante)',
        severity: 'warning'
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Vincular Usuario</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="body1" mb={2}>
                Vincular a {user.name} {user.surname}
              </Typography>

              {/* Si es teacher, mostrar solo el grupo */}
              {user.role === 'teacher' && (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Grupo</InputLabel>
                  <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value)}
                    label="Grupo"
                  >
                    {groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {group.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {/* Si es student, mostrar grupo y padre */}
              {user.role === 'student' && (
                <>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Grupo</InputLabel>
                    <Select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      label="Grupo"
                    >
                      {groups.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {group.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl fullWidth margin="normal">
                    <InputLabel>Padre</InputLabel>
                    <Select
                      value={selectedParent}
                      onChange={(e) => setSelectedParent(e.target.value)}
                      label="Padre"
                    >
                      {parents.map((parent) => (
                        <MenuItem key={parent.id} value={parent.id}>
                          {parent.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="primary" variant="contained">
            Guardar
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

export default LinkUserDialog;