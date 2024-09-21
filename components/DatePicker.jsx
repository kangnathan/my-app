import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import AddPostModal from './AddPostModal';

export default function DatePicker({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  user,
  fetchPosts,
}) {
  const [open, setOpen] = useState(false);

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleClearFilters = () => {
    console.log("Clearing filters");
    setStartDate(null);
    setEndDate(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, marginRight: '15px' }}>
          <Box sx={{ flex: 1 }}>
            <MUIDatePicker
              key={startDate ? 'start-date-set' : 'start-date-clear'}
              label="Start Date"
              value={startDate ?? null}
              onChange={handleStartDateChange}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': { color: 'black' },
                      '& .MuiInputLabel-root': { color: 'black' },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid black',
                        borderRadius: '25px',
                      },
                      '& .MuiSvgIcon-root': { color: 'black' },
                      '& .MuiInputBase-root': { backgroundColor: 'white' },
                    }}
                  />
                ),
              }}
            />
          </Box>
          <Box sx={{ flex: 1 }}>
            <MUIDatePicker
              key={endDate ? 'end-date-set' : 'end-date-clear'}
              label="End Date"
              value={endDate ?? null}
              onChange={handleEndDateChange}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    sx={{
                      width: '100%',
                      '& .MuiInputBase-input': { color: 'black' },
                      '& .MuiInputLabel-root': { color: 'black' },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid black',
                        borderRadius: '25px',
                      },
                      '& .MuiSvgIcon-root': { color: 'black' },
                      '& .MuiInputBase-root': { backgroundColor: 'white' },
                    }}
                  />
                ),
              }}
            />
          </Box>
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Button
            variant="contained"
            color="secondary"
            onClick={handleClearFilters}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 20,
              textTransform: 'none',
              padding: '10px 15px',
              minWidth: '100px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            Clear
          </Button>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: 'white',
              color: 'black',
              borderRadius: 20,
              textTransform: 'none',
              padding: '10px 15px',
              minWidth: '100px',
              marginLeft: '15px',
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            New
          </Button>
        </Box>
      </Box>
      <AddPostModal open={open} onClose={handleClose} userId={user?.id} refetchPosts={fetchPosts} />
    </LocalizationProvider>
  );
}
