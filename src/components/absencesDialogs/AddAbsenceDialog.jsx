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

const AddAbsenceDialog = ({ open, onClose }) => {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    date: '',
    justified: ''  // nuevo campo justified
  });

  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    if (open) {
      api.get('/students.php')
        .then(res => setStudents(res.data))
        .catch(() => {
          setSnackbar({
            open: true,
            message: 'Error al cargar estudiantes',
            severity: 'error'
          });
        });

      const userId = localStorage.getItem('EducaCenterId');
      api.get(`/teachers.php?user_id=${userId}`)
        .then(res => {
          if (Array.isArray(res.data) && res.data.length > 0) {
            setTeacherId(res.data[0].id);
          } else {
            setSnackbar({
              open: true,
              message: 'No se pudo identificar al profesor',
              severity: 'error'
            });
          }
        })
        .catch(() => {
          setSnackbar({
            open: true,
            message: 'Error al identificar al profesor',
            severity: 'error'
          });
        });
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.student_id) newErrors.student_id = 'Seleccione un estudiante';
    if (!formData.date) newErrors.date = 'Seleccione una fecha';
    if (formData.justified === '') newErrors.justified = 'Seleccione justificación';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    if (!teacherId) {
      setSnackbar({
        open: true,
        message: 'No se puede registrar la falta sin identificar al profesor',
        severity: 'error'
      });
      return;
    }

    const payload = {
      student_id: formData.student_id,
      date: formData.date,
      justified: formData.justified === '1' ? 1 : 0,  // enviamos 1 o 0 según selección
      teacher_id: teacherId
    };

    api.post('/absences.php', payload)
      .then(() => {
        setSnackbar({
          open: true,
          message: 'Falta añadida correctamente',
          severity: 'success'
        });
        setFormData({ student_id: '', date: '', justified: '' });
        setErrors({});
        onClose(true);
      })
      .catch(() => {
        setSnackbar({
          open: true,
          message: 'Error al añadir falta',
          severity: 'error'
        });
      });
  };

  const handleCancel = () => {
    setFormData({ student_id: '', date: '', justified: '' });
    setErrors({});
    onClose(false);
  };

  return (
    <>
      <Dialog open={open} onClose={handleCancel} fullWidth maxWidth="sm">
        <DialogTitle>Añadir Falta</DialogTitle>
        <DialogContent>
          <Box component="form" noValidate>
            <FormControl margin="normal" fullWidth required error={!!errors.student_id}>
              <InputLabel>Estudiante</InputLabel>
              <Select
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                label="Estudiante"
              >
                {students.map(student => (
                  <MenuItem key={student.id} value={student.id}>
                    {student.name || student.id}
                  </MenuItem>
                ))}
              </Select>
              {errors.student_id && <FormHelperText>{errors.student_id}</FormHelperText>}
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              label="Fecha de la Falta"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              InputLabelProps={{ shrink: true }}
              error={!!errors.date}
              helperText={errors.date}
            />

            <FormControl margin="normal" fullWidth required error={!!errors.justified}>
              <InputLabel>Justificada</InputLabel>
              <Select
                name="justified"
                value={formData.justified}
                onChange={handleChange}
                label="Justificada"
              >
                <MenuItem value="1">Sí</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
              {errors.justified && <FormHelperText>{errors.justified}</FormHelperText>}
            </FormControl>
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
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddAbsenceDialog;