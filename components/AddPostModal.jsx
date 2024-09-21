'use client';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';

export default function AddPostModal({ open, onClose, userId, refetchPosts }) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/post', { title, content, userId });
            if (response.status === 201) {
                onClose();  // Close modal
                refetchPosts();  // Refresh posts
                setTitle('');  // Clear the title
                setContent('');  // Clear the content
            } else {
                setError('Failed to add the post. Please try again.');
            }
        } catch (error) {
            console.error('Failed to add the post:', error);
            setError('Failed to add the post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} PaperProps={{     sx: {
      borderRadius: '20px', // Adjust the border-radius here
            width: '75%',
      height:'50%',
      p: 2,
      textAlign: 'center',
    },
  }}>
            <DialogTitle>Add New Post</DialogTitle>
            <DialogContent>
                {error && <Typography color="error" gutterBottom>{error}</Typography>}
                <TextField
                    autoFocus
                    placeholder='Title'
                    margin="dense"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
<TextField
  margin="dense"
label="Write your thoughts..."
  type="text"
  fullWidth
  multiline
  rows={4}
  variant="outlined"
  value={content}
  onChange={(e) => setContent(e.target.value)}
  sx={{
    '& .MuiOutlinedInput-root': {
      height: '240px', // Total height including the border
      '& textarea': {
        padding: '10px', // Adjusts padding inside the textarea
        height: '100%',  // Ensures the content fills the specified height
      },
    },
  }}
/>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isLoading} variant="outlined"  sx={{
    mr: 2,
    fontWeight:'bold',
    borderRadius: 1,
    p: '8px 25px',
    color: 'black',         // Sets the font color to black
    borderColor: 'black',   // Sets the outline (border) color to black
    '&:hover': {
      borderColor: 'black', // Ensures the border stays black on hover
      color: 'black',       // Ensures the font stays black on hover
    },
  }}
>
  Cancel
</Button>
                <Button onClick={handleSave} disabled={isLoading} variant="contained"
      sx={{ backgroundColor: '#BB86FC', color: 'white', borderRadius: 1, p: '8px 25px', fontWeight: 'bold',marginRight:'20px' }}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Post'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
