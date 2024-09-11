import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker as MUIDatePicker } from '@mui/x-date-pickers/DatePicker';
import { Grid, TextField, Button } from '@mui/material';

export default function DatePicker({ startDate, setStartDate, endDate, setEndDate }) {

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
  };

  const handleClearFilters = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Grid container spacing={4} sx={{ marginBottom: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <MUIDatePicker
            label="Start Date"
            value={startDate}
            onChange={handleStartDateChange}
            slots={{
              textField: (params) => (
                <TextField
                  {...params}
                  sx={{
                      width: '101.7%',
                      '& .MuiInputBase-input': { color: 'black' },
                      '& .MuiInputLabel-root': { color: 'black' },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid black',
                        borderRadius: '25px',
                      },
                      '& .MuiSvgIcon-root': { color: 'black' },
                      '& .MuiInputBase-root': {
                        backgroundColor: 'white',
                      },
                    }}
                />
              ),
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={4} container alignItems="center">
          <Grid item xs={9}>
            <MUIDatePicker
              label="End Date"
              value={endDate}
              onChange={handleEndDateChange}
              slots={{
                textField: (params) => (
                  <TextField
                    {...params}
                    sx={{
                      width: '125.7%',
                      '& .MuiInputBase-input': { color: 'black' },
                      '& .MuiInputLabel-root': { color: 'black' },
                      '& .MuiOutlinedInput-root': {
                        border: '1px solid black',
                        borderRadius: '25px',
                      },
                      '& .MuiSvgIcon-root': { color: 'black' },
                      '& .MuiInputBase-root': {
                        backgroundColor: 'white',
                      },
                    }}
                  />
                ),
              }}
            />
          </Grid>
          <Grid item xs={3}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClearFilters}
              sx={{
                backgroundColor: 'white',
                color: 'black',
                borderRadius: 20,
                textTransform: 'none',
                marginLeft: '100px',
                width: '150px',
                paddingTop: '10px',
                paddingBottom: '10px',
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
}
