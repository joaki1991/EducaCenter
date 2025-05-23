import React, { useState } from 'react';
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

function Absences({ onLogout }) {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbsence, setSelectedAbsence] = useState(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const userId = localStorage.getItem('EducaCenterId');
  const role = localStorage.getItem('EducaCenterRole');
  const isEditable = role === 'admin' || role === 'teacher';

  const fetchAbsences = async () => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (role === 'admin') {
        response = await api.get('/absences.php');
      } else if (role === 'teacher') {
        response = await api.get(`/absences.php?teacher_id=${userId}`);
      } else if (role === 'student') {
        response = await api.get(`/absences.php?student_id=${userId}`);
      } else if (role === 'parent') {
        // Buscar hijos y sus faltas
        const childrenRes = await api.get(`/students?parent_id=${userId}`);
        const children = childrenRes.data;
        if (children.length === 0) {
          setAbsences([]);
          setLoading(false);
          return;
        }
        const absencePromises = children.map(child =>
          api.get(`/absences.php?student_id=${child.id}`)
            .then(res => res.data)
        );
        const absenceResults = await Promise.all(absencePromises);
        setAbsences(absenceResults.flat());
        setLoading(false);
        return;
      }
      setAbsences(response.data);
    } catch {
      setError('Error al cargar las faltas');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAbsences();
    // eslint-disable-next-line
  }, [role, userId]);

  const handleAdd = () => setAddDialogOpen(true);
  const handleEdit = (absence) => { setSelectedAbsence(absence); setEditDialogOpen(true); };
  const handleDelete = (absence) => { setSelectedAbsence(absence); setDeleteDialogOpen(true); };
  const user = localStorage.getItem('EducaCenterUser');

  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}      
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
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
    >
      <SidePanelLayout header={header}>
        <AbsencesPanel
          absences={absences}
          loading={loading}
          error={error}
          isEditable={isEditable}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </SidePanelLayout>

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
      <AddAbsenceDialog
        open={addDialogOpen}
        onClose={(updated) => {
          setAddDialogOpen(false);
          if (updated) fetchAbsences();
        }}
        studentId={role === 'student' ? userId : undefined}
        teacherId={role === 'teacher' ? userId : undefined}
      />
      <EditAbsenceDialog
        open={editDialogOpen}
        onClose={(updated) => {
          setEditDialogOpen(false);
          if (updated) fetchAbsences();
        }}
        absence={selectedAbsence}
      />
      <DeleteAbsenceDialog
        open={deleteDialogOpen}
        onClose={(updated) => {
          setDeleteDialogOpen(false);
          if (updated) fetchAbsences();
        }}
        absence={selectedAbsence}
      />
    </Box>
  );
}

export default Absences;