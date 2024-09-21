import React, { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Slide from '@mui/material/Slide';
import MuiAlert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';

const ProfileModal = ({ open, onClose, userName, onUserNameChange }) => {
  const [newUserName, setNewUserName] = useState(userName);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (open) {
      setNewUserName(userName);
    }
  }, [open, userName]);

  const handleSave = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newUserName }),
      });

      const data = await response.json();

      if (response.ok) {
        onUserNameChange(newUserName);
        setSnackbarMessage('Name updated successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(data.message || 'Failed to update name.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while updating the name.');
      setSnackbarSeverity('error');
    } finally {
      setSnackbarOpen(true);
      onClose();
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        PaperProps={{ style: { borderRadius: 15, padding: '20px', textAlign: 'center' } }}
      >
        <DialogTitle>
          <Typography variant="h5" style={{ fontWeight: 'bold' }}>
            Edit Profile
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ marginBottom: 2 }}>U</Avatar>
            <TextField
              autoFocus
              margin="dense"
              label="Name"
              type="text"
              fullWidth
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions style={{ justifyContent: 'center' }}>
          <Button onClick={handleSave} variant="contained" style={{ backgroundColor: '#BB86FC', color: 'white', borderRadius: '8px', padding: '8px 16px' }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        TransitionComponent={Slide}
      >
        <MuiAlert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
    </>
  );
};

export default ProfileModal;
