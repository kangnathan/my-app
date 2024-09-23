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
import InputAdornment from '@mui/material/InputAdornment';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const ProfileModal = ({ open, onClose, userName, onUserNameChange }) => {
  const [newUserName, setNewUserName] = useState(userName);
  const [originalPassword, setOriginalPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOriginalPassword, setShowOriginalPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  useEffect(() => {
    if (open) {
      setNewUserName(userName);
      setOriginalPassword('');
      setNewPassword('');
    }
  }, [open, userName]);

  const handleToggleOriginalPasswordVisibility = () => {
    setShowOriginalPassword((prev) => !prev);
  };

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };

  const handleSave = async () => {
    if (newPassword && !originalPassword) {
      setSnackbarMessage('Original password is required to change the password.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    // Password validation logic
    if (newPassword && (newPassword.length < 12 || newPassword.length > 50)) {
      setSnackbarMessage('Password must be between 12 and 50 characters.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newUserName,
          originalPassword: originalPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onUserNameChange(newUserName);
        setSnackbarMessage('Profile updated successfully!');
        setSnackbarSeverity('success');
      } else {
        setSnackbarMessage(data.message || 'Failed to update profile.');
        setSnackbarSeverity('error');
      }
    } catch (error) {
      setSnackbarMessage('An error occurred while updating the profile.');
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
        PaperProps={{ sx: { borderRadius: 2, p: 2, textAlign: 'center' } }}
      >
        <DialogTitle>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            Edit Profile
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
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
            <TextField
              margin="dense"
              label="Original Password"
              type={showOriginalPassword ? 'text' : 'password'}
              fullWidth
              value={originalPassword}
              onChange={(e) => setOriginalPassword(e.target.value)}
              sx={{ marginTop: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleOriginalPasswordVisibility} edge="end">
                      {showOriginalPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="dense"
              label="New Password"
              type={showNewPassword ? 'text' : 'password'}
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              sx={{ marginTop: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleNewPasswordVisibility} edge="end">
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              backgroundColor: '#BB86FC',
              color: 'white',
              borderRadius: '8px',
              padding: '8px 16px',
            }}
          >
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
