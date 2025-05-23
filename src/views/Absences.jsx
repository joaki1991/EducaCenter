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

function Absences({ onLogout }) {
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState(null);

  const [absences, setAbsences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');
  const role = localStorage.getItem('EducaCenterRole');
  const isEditable = role === 'admin' || role === 'teacher';

  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

  const fetchAbsences = React.useCallback(async () => {
    setLoading(true);
    try {
      let response;

      if (role === 'admin') {
        response = await api.get('/absences.php');
      } else if (role === 'teacher') {
        const res = await api.get(`/teachers.php?user_id=${userId}`);
        const teacher = res.data[0];
        if (teacher) {
          response = await api.get(`/absences.php?teacher_id=${teacher.id}`);
        } else {
          setAbsences([]);
          return;
        }
      } else if (role === 'student') {
        const res = await api.get(`/students.php?user_id=${userId}`);
        const student = res.data[0];
        if (student) {
          response = await api.get(`/absences.php?student_id=${student.id}`);
        } else {
          setAbsences([]);
          return;
        }
      } else if (role === 'parent') {
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

        const promises = children.map(child =>
          api.get(`/absences.php?student_id=${child.id}`).then(res =>
            res.data.map(abs => ({ ...abs, student_name: child.name }))
          )
        );
        const allAbsences = (await Promise.all(promises)).flat();
        setAbsences(allAbsences);
        return;
      }

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

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

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

      <UpdateProfilePhoto
        open={photoDialogOpen}
        onClose={() => setPhotoDialogOpen(false)}
        userId={userId}
      />
    </Box>
  );
}

export default Absences;
