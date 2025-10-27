import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  IconButton,
  Grid,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../actions/auth';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const fetchUserFromLocalStorage = () => {
      const userData = localStorage.getItem('mitportal_user');
      if (userData) {
        try {
          navigate('/');
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUserFromLocalStorage();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      setMessage('Please fill in all fields.');
      setSeverity('warning');
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    const loginData = await dispatch(login(username, password));
    const status = loginData.status;
    const message = loginData.message;

    if (!status) {
      setSeverity('error');
      setMessage(message);
      setOpenSnackbar(true);
      setIsLoading(false);
    } else {
      setSeverity('success');
      setMessage(message);
      setOpenSnackbar(true);
      setIsLoading(false);
      navigate('/');
    }
  };

  const handleSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(to right, #e3f2fd, #ffffff)',
      }}
    >
      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbar}
      >
        <Alert onClose={handleSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      <Grid container spacing={4} justifyContent="center" alignItems="center" maxWidth="md">
        {/* Left Side - System Name */}
        <Grid item xs={12} md={6} sx={{ textAlign: 'center' }}>
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            MIT Portal System
          </Typography>
          <Typography variant="h6" color="text.secondary">
            With Notification
          </Typography>
          <Box mt={4}>
            <img
              src="MIT_logo.png" // optional placeholder
              alt="system-logo"
              style={{ maxWidth: '200px' }}
            />
          </Box>
        </Grid>

        {/* Right Side - Login Card */}
        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
                Login
              </Typography>

              {error && (
                <Typography color="error" mb={2}>
                  {error}
                </Typography>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  name="username"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  Login
                </Button>
              </form>

              {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <CircularProgress />
                  <Typography variant="body1" color="primary" ml={2}>
                    Loading...
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
