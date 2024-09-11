'use client';
import { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, CircularProgress, Typography } from '@mui/material';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function EditForm({ open, onClose, postId, initialTitle, initialContent }) {
    const router = useRouter();
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        setIsLoading(true);
        setError('');

        try {
            await axios.put(`/api/post/${postId}`, { title, content });
            router.refresh(); 
            onClose(); // close the form after saving
        } catch (error) {
            console.error("Failed to update the post:", error.response?.data || error.message);
            setError(error.response?.data?.message || 'Failed to update the post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="edit-post-dialog-title"
            aria-describedby="edit-post-dialog-description"
            PaperProps={{
                style: {
                    borderRadius: '25px',
                    backgroundColor: "#d9d9d9",
                    padding: "15px 20px 15px 20px"
                }
            }}
        >
            <DialogTitle id="edit-post-dialog-title">Edit Post</DialogTitle>
            <DialogContent id="edit-post-dialog-description">
                {error && <Typography color="error">{error}</Typography>}
                <TextField
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
                <Button onClick={onClose} style={{
                        marginRight: "15px",
                        color: "black",
                        borderRadius:"20px"
                    }}  disabled={isLoading}>
                    Cancel
                </Button>
                <Button onClick={handleSave} variant='contained' size='small'style={{
                        marginRight: "15px",
                        backgroundColor: "#cd733b",
                        borderRadius:"20px"
                    }} disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} /> : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
