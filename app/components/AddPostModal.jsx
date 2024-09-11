'use client';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddPostModal({ open, onClose }) {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await axios.post('api/post', { title, content });
            
            if (response.status === 201) {
                // Refresh the page to reflect the new post
                router.refresh(); 
                onClose();
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
        <Dialog open={open} onClose={onClose}
            PaperProps={{
                style: {
                    borderRadius: '25px',
                    backgroundColor: "#d9d9d9",
                    padding: "20px 25px 20px 25px"
                }
            }} >
            
            <DialogTitle>Add New Post</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Title"
                    type="text"
                    fullWidth
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <TextField
                    margin="dense"
                    label="Content"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{color:"black"}} disabled={isLoading} >
                    Cancel
                </Button>
                <Button onClick={handleSave} variant='contained' size='small' style={{
                            marginRight: "15px",
                            backgroundColor: "#34a970",
                            borderRadius:"20px"
                        }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Post'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
