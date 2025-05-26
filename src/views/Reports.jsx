// Vista de informes académicos: muestra, agrega, edita y elimina informes según el rol
// Importaciones principales de React, componentes propios y utilidades
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Box } from '@mui/material';
import SidePanelLayout from '../components/SidePanelLayout';
import logo from '../assets/logo.png';
import fondo from '../assets/fondo.png';
import API_BASE from '../api/config';
import UpdateProfilePhoto from '../components/UpdateProfilePhoto';
import ReportsPanel from '../components/ReportsPanel';
import AddReportDialog from '../components/reportsDialogs/AddReportDialog';
import EditReportDialog from '../components/reportsDialogs/EditReportDialog';
import DeleteReportDialog from '../components/reportsDialogs/DeleteReportDialog';
import ViewReportDialog from '../components/reportsDialogs/ViewReportDialog';
import api from '../api/axios';

function Reports({ onLogout }) {
  // Estados para controlar la apertura de los diferentes diálogos
  const [photoDialogOpen, setPhotoDialogOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Estados para la gestión de los informes y la carga de datos
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Obtención de datos del usuario desde localStorage
  const user = localStorage.getItem('EducaCenterUser');
  const userId = localStorage.getItem('EducaCenterId');
  const role = localStorage.getItem('EducaCenterRole');
  // Determina si el usuario puede editar (solo admin o teacher)
  const isEditable = role === 'admin' || role === 'teacher';

  // Componente de cabecera personalizado
  const header = (
    <Header
      userName={user || 'Usuario'}
      userImage={`${API_BASE}/profile_photo/${userId}.jpg`}
      onLogout={onLogout}
      logoImage={logo}
      onOpenPhotoUpdate={() => setPhotoDialogOpen(true)}
    />
  );

// Función para obtener los informes según el rol del usuario
const fetchReports = React.useCallback(async () => {
  setLoading(true);
  try {
    let response;

    if (role === 'admin') {
      response = await api.get('/reports.php');
    } else if (role === 'teacher') {
      // Si es profesor, busca su id y luego los informes asociados
      const res = await api.get(`/teachers.php?user_id=${userId}`);
      const teacher = res.data[0];
      if (teacher) {
        response = await api.get(`/reports.php?teacher_id=${teacher.id}`);
      } else {
        setReports([]);
        return;
      }
    } else if (role === 'student') {
      // Si es estudiante, busca su id y luego sus informes
      const res = await api.get(`/students.php?user_id=${userId}`);
      const student = res.data[0];
      if (student) {
        response = await api.get(`/reports.php?student_id=${student.id}`);
      } else {
        setReports([]);
        return;
      }
    } else if (role === 'parent') {
      // Si es padre, busca sus hijos y los informes de cada uno
      const res = await api.get(`/parents.php?user_id=${userId}`);
      const parent = res.data[0];
      if (!parent) {
        setReports([]);
        return;
      }

      const childrenRes = await api.get(`/students.php?parent_id=${parent.id}`);
      const children = childrenRes.data;
      if (children.length === 0) {
        setReports([]);
        return;
      }

      // Obtiene los informes de todos los hijos en paralelo
      const promises = children.map(child =>
        api.get(`/reports.php?student_id=${child.id}`).then(res =>
          res.data.map(report => ({ ...report, student_name: child.name }))
        )
      );
      const allReports = (await Promise.all(promises)).flat();
      setReports(allReports);
      return;
    }

    if (response) {
      setReports(response.data);
    }
  } catch (err) {
    console.error(err);
    setError('Error al cargar los informes');
  } finally {
    setLoading(false);
  }
}, [role, userId]);

  // Efecto para cargar los informes al montar el componente o cambiar el rol/usuario
  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
      {/* Layout principal con panel lateral y cabecera */}
      <SidePanelLayout header={header}>
        <ReportsPanel
          reports={reports}
          loading={loading}
          error={error}
          isEditable={isEditable}
          onAdd={() => setAddOpen(true)}
          onEdit={(report) => {
            setSelectedReport(report);
            setEditOpen(true);
          }}
          onDelete={(report) => {
            setSelectedReport(report);
            setDeleteOpen(true);
          }}
          onView={(report) => {
            setSelectedReport(report);
            setViewOpen(true);
          }}
        />
      </SidePanelLayout>

      {/* Diálogos para agregar, editar, eliminar y ver informes */}
      <AddReportDialog
        open={addOpen}
        onClose={(updated) => {
          setAddOpen(false);
          if (updated) fetchReports();
        }}
      />
      <EditReportDialog
        open={editOpen}
        report={selectedReport}
        onClose={(updated) => {
          setEditOpen(false);
          if (updated) fetchReports();
        }}
      />
      <DeleteReportDialog
        open={deleteOpen}
        report={selectedReport}
        onClose={(deleted) => {
          setDeleteOpen(false);
          if (deleted) fetchReports();
        }}
      />
      <ViewReportDialog
        open={viewOpen}
        report={selectedReport}
        onClose={() => setViewOpen(false)}
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

export default Reports;