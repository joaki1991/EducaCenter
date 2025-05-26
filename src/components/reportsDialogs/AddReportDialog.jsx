// Componente AddReportDialog: diálogo para agregar un nuevo informe académico
// Permite seleccionar estudiante y escribir el contenido del informe
// Realiza la petición a la API para crear el informe y muestra feedback
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText
} from '@mui/material';
import api from '../../api/axios';

const AddReportDialog = ({ open, onClose }) => {
  // Estado para la lista de estudiantes
  const [students, setStudents] = useState([]);
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    student_id: '',
    content: ''
  });

  // Estado para errores de validación
  const [errors, setErrors] = useState({});
  // Estado para el snackbar de mensajes
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // Estado para el id del profesor
  const [teacherId, setTeacherId] = useState(null);

  // Efecto para cargar estudiantes y obtener el id del profesor al abrir el diálogo
  useEffect(() => {
    if (open) {
      // Obtener estudiantes
      api.get('/students.php')
        .then(res => setStudents(res.data))
        .catch(err => {
          console.error('Error al cargar estudiantes:', err);
          setSnackbar({
            open: true,
            message: 'Error al cargar estudiantes',
            severity: 'error'
          });
        });

      // Obtener el ID del teacher asociado al usuario logueado
      const userId = localStorage.getItem('EducaCenterId');
      api.get(`/teachers.php?user_id=${userId}`)
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setTeacherId(res.data[0].id);
          } else {
            console.error('No se encontró el teacher con ese user_id');
            setSnackbar({
              open: true,
              message: 'No se pudo identificar al profesor',
              severity: 'error'
            });
          }
        })
        .catch(err => {
          console.error('Error al obtener teacher_id:', err);
          setSnackbar({
            open: true,
            message: 'Error al identificar al profesor',
            severity: 'error'
          });
        });
    }
  }, [open]);

  // Maneja el cambio de los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Valida los campos del formulario antes de enviar
  const validate = () => {
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = 'Seleccione un estudiante';
    if (!formData.content.trim()) newErrors.content = 'El contenido es obligatorio';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Maneja el envío del formulario para crear el informe
  const handleSubmit = () => {
    if (!validate()) return;
    if (!teacherId) {
      setSnackbar({
        open: true,
        message: 'No se puede enviar el informe sin identificar al profesor',
        severity: 'error'
      });
      return;
    }

    const payload = {
      student_id: formData.student_id,
      content: formData.content.trim(),
      teacher_id: teacherId
    };

    api.post('/reports.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Informe añadido correctamente',
          severity: 'success'
        });
        setFormData({ student_id: '', content: '' });
        setErrors({});
        onClose(true);
      })
      .catch((err) => {
        // Manejo de error al añadir informe
        console.error('Error al añadir informe:', err);
        setSnackbar({
          open: true,
          message: 'Error al añadir informe',
          severity: 'error'
        });
      });
  };

  // Maneja la cancelación y reseteo del formulario
  const handleCancel = () => {
    setFormData({ student_id: '', content: '' });
    setErrors({});
    onClose(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Añadir Informe</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <FormControl
              margin="normal"
              fullWidth
              required
              error={!!errors.student_id}
            >
              <InputLabel>Estudiante</InputLabel>
              <Select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                label="Estudiante"
              >
                {students.map((student) => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name || student.id}
                  </MenuItem>
                ))}
              </Select>
              {errors.student_id && (
                <FormHelperText>{errors.student_id}</FormHelperText>
              )}
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              label="Contenido del Informe"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              multiline
              rows={4}
              error={!!errors.content}
              helperText={errors.content}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancelar</Button>
          <Button variant="contained" color="primary" onClick={handleSubmit}>
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddReportDialog;