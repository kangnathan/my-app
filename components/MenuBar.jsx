import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { useRouter } from 'next/navigation';
import ProfileModal from './ProfileModal';

export default function MenuBar() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [userName, setUserName] = React.useState('');
  const [profileModalOpen, setProfileModalOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const fetchUserName = async () => {
      try {
        const response = await fetch('/api/posts');
        const data = await response.json();
        if (data.userName) {
          setUserName(data.userName);
        }
      } catch (error) {
        console.error('Failed to fetch user name:', error);
      }
    };

    fetchUserName();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileOpen = () => {
    setProfileModalOpen(true);
    handleClose();
  };

  const handleProfileClose = () => {
    setProfileModalOpen(false);
  };

  const handleUserNameChange = (newUserName) => {
    setUserName(newUserName);
    // Optionally, send this change to the server
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
      }
    } catch {
      console.error("Logout request failed");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Toolbar>
        <Typography
          variant="h4"
          component="div"
          sx={{
            flexGrow: 1,
            color: 'white',
            fontWeight: 'bold',
            marginLeft: '50px',
            textAlign: 'left',
          }}
        >
          Quick<span style={{ color: '#BB86FC' }}>CRUD</span>
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginRight:'40px' }}>
          {userName && (
            <Typography
              variant="body1"
              sx={{
                marginRight: 2,
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {userName}
            </Typography>
          )}
          <div>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              sx={{ color: 'white' }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'bottom', // Position menu below the avatar
                horizontal: 'left',  // Align to the left of the avatar
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',    // Align top of menu to the bottom of the avatar
                horizontal: 'left',  // Align to the left of the menu
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleProfileOpen}                 sx={{
                  '&:hover': {
                    backgroundColor: '#BB86FC',
                    color: 'white',
                  },
                }}>Profile</MenuItem>
              <MenuItem
                onClick={handleLogout}
                sx={{
                  '&:hover': {
                    backgroundColor: '#BB86FC',
                    color: 'white',
                  },
                }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </div>
        </Box>
      </Toolbar>
      <ProfileModal
        open={profileModalOpen}
        onClose={handleProfileClose}
        userName={userName}
        onUserNameChange={handleUserNameChange}
      />
    </Box>
  );
}
