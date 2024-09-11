import { useState } from 'react';
import { Card, CardContent, Typography, Divider } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditIcon from '@mui/icons-material/Edit'; // Import the EditIcon
import DeleteForm from './DeleteForm';
import EditForm from './EditForm'; // Rename to EditForm for consistency
import { formatDateTime } from '@/utils/formatDateTime';

export default function Post({ id, title, content, authorName, createdAt, updatedAt, deletedAt }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDeleteClick = () => {
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleEditClick = () => {
    setEditOpen(true);
  };

  const handleEditClose = () => {
    setEditOpen(false);
  };

  return (
    <Card sx={{ backgroundColor: '#5a5a5a', borderRadius: 5 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ color: 'white' }}>
          {title}
        </Typography>

        <Typography sx={{ color: '#cccccc', marginTop: '10px' }}>
          {content}
        </Typography>

        <Divider sx={{ marginY: '10px' }} />

        <div>
          <Typography variant="h5" component="div" sx={{ color: '#aaaaaa', fontSize: '13px' }}>
            Author: {authorName}
          </Typography>

          <Typography sx={{ color: '#aaaaaa', fontSize: '13px' }}>
            Created at: {formatDateTime(createdAt)}
          </Typography>

          {updatedAt && (
            <Typography sx={{ color: '#aaaaaa', fontSize: '13px' }}>
              Updated at: {formatDateTime(updatedAt)}
            </Typography>
          )}

          {deletedAt && (
            <Typography sx={{ color: '#ff6b6b', marginTop: '10px', fontSize: '13px' }}>
              This post was deleted on {formatDateTime(deletedAt)}
            </Typography>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'end', marginTop: '20px', gap: '10px' }}>
          <DeleteRoundedIcon onClick={handleDeleteClick} style={{ color: 'white' }} />
          <EditIcon onClick={handleEditClick} style={{ color: 'white' }} /> {/* Clickable Edit Icon */}
        </div>

        <DeleteForm postId={id} open={deleteOpen} onClose={handleDeleteClose} />
        <EditForm postId={id} initialTitle={title} initialContent={content} open={editOpen} onClose={handleEditClose} />
      </CardContent>
    </Card>
  );
}
