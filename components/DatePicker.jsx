import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, TextField, Button } from '@mui/material';
import { useState } from 'react';
import AddPostModal from './AddPostModal'; // Ensure the path is correct

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
    console.log("Clearing filters"); // Debugging line
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
        
        {/* Date Picker Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1, marginRight: '15px' }}>
          
          {/* Start Date Picker */}
          <Box sx={{ flex: 1 }}>
            <MUIDatePicker
              key={startDate ? 'start-date-set' : 'start-date-clear'} // Force re-render on clear
              label="Start Date"
              value={startDate ?? null} // Ensure null is properly handled
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

          {/* End Date Picker */}
          <Box sx={{ flex: 1 }}>
            <MUIDatePicker
              key={endDate ? 'end-date-set' : 'end-date-clear'} // Force re-render on clear
              label="End Date"
              value={endDate ?? null} // Ensure null is properly handled
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
          {/* Clear Filters Button */}
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

          {/* New Button Section */}
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
              marginLeft: '15px', // Space between buttons
              '&:hover': {
                backgroundColor: '#f0f0f0',
              },
            }}
          >
            New
          </Button>
        </Box>
      </Box>

      {/* AddPostModal */}
      <AddPostModal open={open} onClose={handleClose} userId={user?.id} refetchPosts={fetchPosts} />
    </LocalizationProvider>
  );
}
