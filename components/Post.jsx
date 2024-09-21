'use client';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, IconButton, Modal, Box, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import SaveIcon from '@mui/icons-material/Save';
import { formatDateTime } from '../utils/formatDateTime';

const Post = ({ post, refetchPosts }) => {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(true);
  const [editedPost, setEditedPost] = useState(post);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleExpandClick = useCallback(() => setExpanded(true), []);
  const handleClose = useCallback(() => setExpanded(false), []);
  const handleEditToggle = useCallback(() => setEditing(prev => !prev), []);
  
  const handleSave = useCallback(async () => {
    try {
      await axios.put(`/api/post/${post.id}`, {
        title: editedPost.title,
        content: editedPost.content,
      });
      setEditing(false);
      handleClose(); // Close the modal after saving
      if (refetchPosts) refetchPosts(); 
    } catch (error) {
      console.error('Failed to save post:', error);
    }
  }, [editedPost, post.id, refetchPosts, handleClose]);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await axios.delete(`/api/post/${post.id}`);
      setDeleteDialogOpen(false);
      handleClose();
      if (refetchPosts) refetchPosts(post.id); // Remove post from parent state
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }, [post.id, handleClose, refetchPosts]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  return (
    <>
      <Card 
        sx={{
          backgroundColor:'white',
          width: 265,
          height: 300,
          borderRadius: '4%',
          mb: 2, 
          cursor: 'pointer', 
          position: 'relative',
          border: '1px solid #ccc',
          padding: '10px',
          '&:hover .delete-icon': {
            opacity: 1,
          }
        }} 
        onClick={handleExpandClick}
      >
        <CardContent>
          <Typography variant="h6" component="div" color="black" sx={{ wordBreak: 'break-word' }}>
            {post.title}
          </Typography>
          <Typography 
            variant="body2" 
            color={post.content ? 'black' : 'text.disabled'} 
            sx={{ mt: 1, wordBreak: 'break-word' }}
          >
            {expanded 
              ? post.content 
              : (post.content ? post.content.slice(0, 350) + (post.content.length > 150 ? '...' : '') : <i>No content provided.</i>)
            }
          </Typography>
        </CardContent>
        {!expanded && (
<IconButton 
  className="delete-icon" 
  onClick={handleDeleteClick} 
  sx={{ 
    color: '#FF4F4F',         // Change the color of the icon inside the button
    position: 'absolute', 
    top: 8, 
    right: 8, 
    opacity: 0, 
    transition: 'opacity 0.3s ease-in-out',
    '&:hover': {
      opacity: 1
    }
  }}
>
  <DeleteRoundedIcon />
</IconButton>
        )}
      </Card>

<Dialog
  open={expanded}
  onClose={handleClose}
  PaperProps={{     sx: {
      borderRadius: '20px', // Adjust the border-radius here
            width: '75%',
      height:'50%',
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
      height: '160px', // Total height including the border
      '& textarea': {

        height: '100%',  // Ensures the content fills the specified height
      },
    },
  }}
          />
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%', mb: 2, marginTop:'15px' }}>
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
        <Box sx={{ display: 'flex', justifyContent: 'end', mt: 2, marginRight:'20px' }}>
            <IconButton onClick={handleSave} disabled={!editing}>
              <SaveIcon sx={{color: '#BB86FC'}}/>
            </IconButton>
            <IconButton onClick={handleDeleteClick} color="error">
              <DeleteRoundedIcon sx={{color: '#FF4F4F'}}/>
            </IconButton>
          </Box>
</Dialog>


      {/* Delete Confirmation Dialog */}
<Dialog
  open={deleteDialogOpen}
  onClose={handleDeleteCancel}
  PaperProps={{
    sx: {
      borderRadius: '20px', // Adjust the border-radius here
      width: '18.5%',
      p: 2,
      textAlign: 'center',
    },
  }}
>
  <DialogTitle sx={{ fontWeight: 'bold' }}>Are you sure?</DialogTitle>
  <DialogContent>
    <Typography variant="body1" sx={{ color: 'gray', mb: -1 }}>
      Are you sure you want to delete this post? <br/> This action cannot be undone.
    </Typography>
  </DialogContent>
  <DialogActions sx={{ justifyContent: 'center' }}>
<Button
  onClick={handleDeleteCancel}
  variant="outlined"
  sx={{
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
    <Button
      onClick={handleDeleteConfirm}
      variant="contained"
      sx={{ backgroundColor: '#FF4F4F', color: 'white', borderRadius: 1, p: '8px 25px', fontWeight: 'bold' }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

    </>
  );
};

export default Post;
