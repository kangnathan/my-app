'use client';
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import DeletePostDialog from './DeletePostDialog';  // Import the delete component
import EditPostDialog from './EditPostDialog';  // Import the new edit component

const Post = ({ post, refetchPosts }) => {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleExpandClick = useCallback(() => setExpanded(true), []);
  const handleClose = useCallback(() => setExpanded(false), []);

  const handleDeleteClick = useCallback(() => {
    setDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async (postId) => {
    try {
      await axios.delete(`/api/post/${postId}`);
      setDeleteDialogOpen(false);
      handleClose();
      if (refetchPosts) refetchPosts(postId);
    } catch (error) {
      console.error('Failed to delete post:', error);
    }
  }, [handleClose, refetchPosts]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteDialogOpen(false);
  }, []);

  return (
    <>
      <Card 
        sx={{
          backgroundColor: 'white',
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
            {post.content ? post.content.slice(0, 350) + (post.content.length > 150 ? '...' : '') : <i>No content provided.</i>}
          </Typography>
        </CardContent>
        {!expanded && (
          <IconButton 
            className="delete-icon" 
            onClick={(e) => { e.stopPropagation(); handleDeleteClick(); }} 
            sx={{ 
              color: '#FF4F4F',
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

      {/* Edit Post Dialog */}
      <EditPostDialog 
        post={post}
        open={expanded}
        onClose={handleClose}
        refetchPosts={refetchPosts}
      />

      {/* Delete Post Dialog */}
      <DeletePostDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={() => handleDeleteConfirm(post.id)}  // Pass post ID for deletion
        postId={post.id}  // Pass post ID to DeletePostDialog
      />
    </>
  );
};

export default Post;
