import React from 'react';
import {
  Dialog,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Slide,
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const ViewReportDialog = ({ open, onClose, report }) => {
  return (
    <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Informe del estudiante
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ padding: 3 }}>
        <Typography variant="h6">
          Estudiante: {report?.student_name || report?.student_id}
        </Typography>
        <Typography variant="h6">
          Profesor: {report?.teacher_name || report?.teacher_id}
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          Fecha: {report?.created_at || 'Sin fecha'}
        </Typography>
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {report?.content || 'Sin contenido'}
        </Typography>
      </Box>
    </Dialog>
  );
};

export default ViewReportDialog;