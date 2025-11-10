import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Grid, MenuItem, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    gender: '',
    civilStatus: '',
    pwdType: '',
    municipality: '',
    barangay: '',
  });

  const navigate = useNavigate(); // Navigation Hook

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert('Registration Successful!');
  };

  return (
    <Box sx={{ flexGrow: 1, p: 4 }}>
      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">GAD MIS Registration</Typography>
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField label="First Name" name="firstName" fullWidth onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Last Name" name="lastName" fullWidth onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Email" name="email" fullWidth onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Password" name="password" type="password" fullWidth onChange={handleChange} required />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Phone Number" name="phoneNumber" fullWidth onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Gender" name="gender" fullWidth onChange={handleChange} required>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField select label="Civil Status" name="civilStatus" fullWidth onChange={handleChange} required>
                  <MenuItem value="Single">Single</MenuItem>
                  <MenuItem value="Married">Married</MenuItem>
                  <MenuItem value="Divorced">Divorced</MenuItem>
                  <MenuItem value="Widowed">Widowed</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField select label="PWD Type" name="pwdType" fullWidth onChange={handleChange}>
                  <MenuItem value="">Not Applicable</MenuItem>
                  <MenuItem value="Physical">Physical</MenuItem>
                  <MenuItem value="Visual">Visual</MenuItem>
                  <MenuItem value="Hearing">Hearing</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Municipality" name="municipality" fullWidth onChange={handleChange} required />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField label="Barangay" name="barangay" fullWidth onChange={handleChange} required />
              </Grid>

              {/* Buttons Section */}
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ mr: 2 }}>
                  Register
                </Button>
                <Button variant="outlined" color="primary" onClick={() => navigate('/signin')} sx={{ mr: 2 }}>
                  Go to Login
                </Button>
                <Button variant="outlined" color="secondary" onClick={() => navigate(-1)}>
                  Back
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;
