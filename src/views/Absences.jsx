// Vista de faltas de asistencia: muestra, agrega, edita y elimina faltas según el rol
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import AbsencesPanel from '../components/AbsencesPanel';
import AddAbsenceDialog from '../components/absencesDialogs/AddAbsenceDialog';
import EditAbsenceDialog from '../components/absencesDialogs/EditAbsenceDialog';
import DeleteAbsenceDialog from '../components/absencesDialogs/DeleteAbsenceDialog';
import api from '../api/axios';

// Componente principal de la vista de faltas de asistencia
function Absences({ onLogout }) {
  // Estado para controlar la apertura del diálogo de foto de perfil
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  // Estado para controlar la apertura del diálogo de agregar falta
  const [addOpen, setAddOpen] = useState(false);
  // Estado para controlar la apertura del diálogo de edición de falta
  const [editOpen, setEditOpen] = useState(false);
  // Estado para controlar la apertura del diálogo de eliminación de falta
  const [deleteOpen, setDeleteOpen] = useState(false);
  // Estado para almacenar la falta seleccionada
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  // Estado para la lista de faltas
  const [absences, setAbsences] = useState([]);
  // Estado de carga
  const [loading, setLoading] = useState(true);
  // Estado de error
  const [error, setError] = useState(null);

  // Obtención de datos del usuario desde localStorage
  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');
  const role = localStorage.getItem('EducaCenterRole');
  // Determina si el usuario puede editar (solo admin o teacher)
  const isEditable = role === 'admin' || role === 'teacher';

  // Cabecera personalizada
  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  // Obtiene las faltas según el rol
  const fetchAbsences = React.useCallback(async () => {
    setLoading(true);
    try {
      let response;
      // Si es admin obtiene todas las faltas
      if (role === 'admin') {
        response = await api.get('/absences.php');
      } else if (role === 'teacher') {
        // Si es profesor, busca su id y luego las faltas asociadas
        const res = await api.get(`/teachers.php?user_id=${userId}`);
        const teacher = res.data[0];
        if (teacher) {
          response = await api.get(`/absences.php?teacher_id=${teacher.id}`);
        } else {
          setAbsences([]);
          return;
        }
      } else if (role === 'student') {
        // Si es estudiante, busca su id y luego sus faltas
        const res = await api.get(`/students.php?user_id=${userId}`);
        const student = res.data[0];
        if (student) {
          response = await api.get(`/absences.php?student_id=${student.id}`);
        } else {
          setAbsences([]);
          return;
        }
      } else if (role === 'parent') {
        // Si es padre, busca sus hijos y las faltas de cada uno
        const res = await api.get(`/parents.php?user_id=${userId}`);
        const parent = res.data[0];
        if (!parent) {
          setAbsences([]);
          return;
        }
        const childrenRes = await api.get(`/students.php?parent_id=${parent.id}`);
        const children = childrenRes.data;
        if (children.length === 0) {
          setAbsences([]);
          return;
        }
        // Obtiene las faltas de todos los hijos en paralelo
        const promises = children.map(child =>
          api.get(`/absences.php?student_id=${child.id}`).then(res =>
            res.data.map(abs => ({ ...abs, student_name: child.name }))
          )
        );
        const allAbsences = (await Promise.all(promises)).flat();
        setAbsences(allAbsences);
        return;
      }
      // Si hay respuesta, actualiza el estado de faltas
      if (response) {
        setAbsences(response.data);
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar las faltas de asistencia');
    } finally {
      setLoading(false);
    }
  }, [role, userId]);

  // Efecto para cargar las faltas al montar el componente o cambiar el rol/usuario
  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  // Render principal
  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100%',
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Layout principal y panel de faltas */}
      <SidePanelLayout header={header}>
        <AbsencesPanel
          absences={absences}
          loading={loading}
          error={error}
          isEditable={isEditable}
          onAdd={() => setAddOpen(true)}
          onEdit={(absence) => {
            setSelectedAbsence(absence);
            setEditOpen(true);
          }}
          onDelete={(absence) => {
            setSelectedAbsence(absence);
            setDeleteOpen(true);
          }}         
        />
      </SidePanelLayout>

      {/* Diálogos de gestión de faltas */}
      <AddAbsenceDialog
        open={addOpen}
        onClose={(updated) => {
          setAddOpen(false);
          if (updated) fetchAbsences();
        }}
      />
      <EditAbsenceDialog
        open={editOpen}
        absence={selectedAbsence}
        onClose={(updated) => {
          setEditOpen(false);
          if (updated) fetchAbsences();
        }}
      />
      <DeleteAbsenceDialog
        open={deleteOpen}
        absence={selectedAbsence}
        onClose={(deleted) => {
          setDeleteOpen(false);
          if (deleted) fetchAbsences();
        }}
      />      

      {/* Diálogo para actualizar la foto de perfil */}
      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

export default Absences;
