'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress, Typography } from '@mui/material';

export default function DeleteForm({ postId, open, onClose }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`/api/post/${postId}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete the post');
            }

            router.refresh();
            onClose();
        } catch (e) {
            console.error('Failed to delete the post:', e);
            setError('Failed to delete the post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            PaperProps={{
                style: {
                    borderRadius: '25px',
                    backgroundColor: "#d9d9d9",
                    padding: "8px 13px 8px 13px"
                },
            }}
        >
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
                {error && <Typography color="error">{error}</Typography>}
                <Typography>Are you sure you want to delete this post?</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{ color: "black", borderRadius: "20px" }}>
                    Cancel
                </Button>
                <Button
                    onClick={handleDelete}
                    variant='contained'
                    size='small'
                    style={{
                        marginRight: "15px",
                        backgroundColor: "#d45555",
                        borderRadius: "20px"
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? <CircularProgress size={24} /> : 'Delete'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
