import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography, Button } from '@mui/material';

const DeletePostDialog = ({ open, onClose, onConfirm, postId }) => {
  const handleConfirm = () => {
    if (postId) {
      onConfirm(postId); // Pass the post ID to the confirm function
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          width: '18.5%',
          p: 2,
          textAlign: 'center',
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 'bold' }}>Are you sure?</DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: 'gray', mb: -1 }}>
          Are you sure you want to delete this post? <br /> This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            mr: 2,
            fontWeight: 'bold',
            borderRadius: 1,
            p: '8px 25px',
            color: 'black',
            borderColor: 'black',
            '&:hover': {
              borderColor: 'black',
              color: 'black',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          sx={{ backgroundColor: '#FF4F4F', color: 'white', borderRadius: 1, p: '8px 25px', fontWeight: 'bold' }}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeletePostDialog;
