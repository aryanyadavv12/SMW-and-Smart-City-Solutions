import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle,
  Dashboard,
  Delete,
  Route,
  Report,
  Analytics,
  People,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin, isCollector } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleMenuClose();
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'collector':
        return 'warning';
      default:
        return 'primary';
    }
  };

  return (
    <AppBar position="static" elevation={2}>
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: { xs: 1, md: 0 },
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 600,
            mr: 4,
          }}
        >
          SWM Solutions
        </Typography>

        {isAuthenticated && (
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, flexGrow: 1 }}>
            <Button
              color="inherit"
              component={Link}
              to="/dashboard"
              startIcon={<Dashboard />}
            >
              Dashboard
            </Button>
            <Button
              color="inherit"
              component={Link}
              to="/waste-requests"
              startIcon={<Delete />}
            >
              Requests
            </Button>
            {(isCollector || isAdmin) && (
              <Button
                color="inherit"
                component={Link}
                to="/collection-routes"
                startIcon={<Route />}
              >
                Routes
              </Button>
            )}
            <Button
              color="inherit"
              component={Link}
              to="/complaints"
              startIcon={<Report />}
            >
              Complaints
            </Button>
            {isAdmin && (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/analytics"
                  startIcon={<Analytics />}
                >
                  Analytics
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/users"
                  startIcon={<People />}
                >
                  Users
                </Button>
              </>
            )}
          </Box>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated ? (
            <>
              <Chip
                label={user?.role?.toUpperCase()}
                color={getRoleColor(user?.role)}
                size="small"
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              />
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  {user?.name?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                  <AccountCircle sx={{ mr: 1 }} /> Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button
                color="inherit"
                variant="outlined"
                component={Link}
                to="/register"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

