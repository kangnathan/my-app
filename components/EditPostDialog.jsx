import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Dialog, DialogContent, DialogTitle, TextField, Box, Typography, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { formatDateTime } from '../utils/formatDateTime';
import DeletePostDialog from './DeletePostDialog'; // Import the DeletePostDialog component

const EditPostDialog = ({ post, open, onClose, refetchPosts }) => {
  const [editing, setEditing] = useState(true);
  const [editedPost, setEditedPost] = useState(post);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleSave = useCallback(async () => {
    try {
      await axios.put(`/api/post/${post.id}`, {
        title: editedPost.title,
        content: editedPost.content,
      });
      setEditing(false);
      onClose();
      if (refetchPosts) refetchPosts();
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  }, [editedPost, post.id, refetchPosts, onClose]);

  const handleDelete = async (postId) => {
    try {
      await axios.delete(`/api/post/${postId}`);
      setDeleteDialogOpen(false);
      onClose();
      if (refetchPosts) refetchPosts();
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            width: '75%',
            height: '50%',
            p: 2,
            textAlign: 'center',
          },
        }}
      >
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            variant="outlined"
            placeholder='Title'
            value={editedPost.title}
            onChange={(e) => setEditedPost(prev => ({ ...prev, title: e.target.value }))} 
            sx={{ mb: 2 }}
            disabled={!editing}
          />
          <TextField
            fullWidth
            variant="outlined"
            multiline
            minRows={4}
            value={editedPost.content}
            onChange={(e) => setEditedPost(prev => ({ ...prev, content: e.target.value }))} 
            disabled={!editing}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: '160px',
                '& textarea': {
                  height: '100%',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', mb: 2, marginTop: '15px' }}>
            {post.author?.name && (
              <Typography variant="caption" color="text.secondary">
                Author: {post.author.name}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              Created At: {formatDateTime(post.createdAt)}
            </Typography>
            {post.updatedAt && (
              <Typography variant="caption" color="text.secondary">
                Updated At: {formatDateTime(post.updatedAt)}
              </Typography>
            )}
            {post.deletedAt && (
              <Typography variant="caption" color="error">
                Deleted At: {formatDateTime(post.deletedAt)}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2, marginRight: '20px' }}>
          <IconButton onClick={handleSave} disabled={!editing}>
            <SaveIcon sx={{ color: '#BB86FC' }}/>
          </IconButton>
          <IconButton onClick={() => setDeleteDialogOpen(true)} color="error">
            <DeleteRoundedIcon sx={{ color: '#FF4F4F' }}/>
          </IconButton>
        </Box>
      </Dialog>

      <DeletePostDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        postId={post.id} // Pass the post ID for deletion
      />
    </>
  );
};

export default EditPostDialog;
