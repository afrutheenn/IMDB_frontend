import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import { Logout, AccountCircle } from '@mui/icons-material';

const Navbar = ({ authState = false }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(authState);
  const navigate = useNavigate();
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };
    checkAuth();
    window.addEventListener('storage', checkAuth);
    const authListener = () => checkAuth();
    window.addEventListener('auth-change', authListener);
    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', authListener);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
    window.location.reload();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Button color="inherit" component={Link} to="/">
            IMDB Clone
          </Button>
        </Typography>
        
        {isAuthenticated ? (
          <>
            <IconButton color="inherit" onClick={handleLogout}>
              <Logout />
            </IconButton>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;