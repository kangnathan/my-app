"use client";
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function DeleteForm({ open, onClose, onConfirm }) {
    return (
        <Dialog open={open} onClose={onClose} PaperProps={{ style: { borderRadius: 15, padding: '20px', textAlign: 'center' } }}>
            <DialogTitle>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    Are you sure?
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
                <Typography variant="body1" style={{ color: 'gray', marginBottom: '20px' }}>
                    Are you sure you want to delete this post? This action cannot be undone.
                </Typography>
            </DialogContent>
            <DialogActions style={{ justifyContent: 'center' }}>
                <Button onClick={onClose} variant="outlined" color="primary" style={{ marginRight: '10px', borderRadius: '8px', padding: '8px 16px' }}>
                    Cancel
                </Button>
                <Button onClick={onConfirm} variant="contained" style={{ backgroundColor: '#ff4081', color: 'white', borderRadius: '8px', padding: '8px 16px' }}>
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
