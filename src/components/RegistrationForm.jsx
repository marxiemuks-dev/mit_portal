import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  Container,
  MenuItem,
  Paper,
  Divider,
  Button,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useDispatch } from "react-redux";
import { addStudent } from '../actions/student';

export default function RegistrationForm ({setOpenRegister}){
  const [formData, setFormData] = useState({
    student_no: '',
    lrn: '',
    date_enrolled: null,
    last_name: '',
    first_name: '',
    middle_name: '',
    extension_name: '',
    gender: '',
    date_of_birth: null,
    student_email: '',
    father_name: '',
    mother_name: '',
    guardian_contact: '',
    guardian_email: '',
    // Academic Information
    course: '',
    year_level: '',
    scholarship_status: '',
    // Educational Background
    elementary_school: '',
    elementary_year_graduated: '',
    junior_high_school: '',
    junior_high_year_graduated: '',
    senior_high_school: '',
    senior_high_year_graduated: '',
    last_school_attended: '',
    last_school_year_attended: '',
    college_school: '',
    college_year_graduated: ''
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // start loading

    try {
      const response = await dispatch(addStudent(formData));
      console.log(response)
      if (response.status === true) {
        setSnackbar({
          open: true,
          message: "Applicant registered successfully!",
          severity: "success"
        });
        setFormData({});
        setOpenRegister(false)
      } else {
        setSnackbar({
          open: true,
          message: response.message,
          severity: "error"
        });
      }
    } catch (error) {
      console.error("Caught error:", error);
      setSnackbar({
        open: true,
        message: "Something went wrong. Please try again.",
        severity: "error"
      });
    } finally {
      setLoading(false); // stop loading
    }
  };

  // Options for dropdowns
  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester", "Summer"];
  const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];

  // Options for dropdowns
  const courses = [
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Criminology",
    "Bachelor of Science in Elementary Education",
    "Bachelor of Science in Engineering",
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Nursing",
    "Bachelor of Science in Social Work",
    "HRM (Hotel and Restaurant Management)",
  ];
const scholarshipOptions = ['None', 'Academic Scholarship','Brother & Sister','HASSAN Scholarship','HALUN Scholarship','UNIFAST','TDP','AHME'];

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            MAHARDIKA INSTITUTE OF TECHNOLOGY
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            PERMANENT REGISTRATION FORM
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          {/* Student Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              Student Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Student No."
                  value={formData.student_no}
                  onChange={(e) => handleInputChange('student_no', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="LRN (Learner Reference Number)"
                  value={formData.lrn}
                  onChange={(e) => handleInputChange('lrn', e.target.value)}
                  size="small"
                  inputProps={{ maxLength: 12 }}
                  placeholder="12-digit number"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date Enrolled"
                    value={formData.dateEnrolled}
                    onChange={(newValue) => handleInputChange('date_enrolled', newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              {/* Name Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('last_name', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('first_name', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Middle Name"
                  value={formData.middleName}
                  onChange={(e) => handleInputChange('middle_name', e.target.value)}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Extension Name (e.g. Jr., Sr., III)"
                  value={formData.extensionName}
                  onChange={(e) => handleInputChange('extension_name', e.target.value)}
                  size="small"
                  placeholder="e.g. Jr., Sr., III"
                />
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="gender-label"
                    id="gender-select"
                    value={formData.gender}
                    label="Gender"
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(newValue) => handleInputChange('date_of_birth', newValue)}
                    slotProps={{
                      textField: {
                        size: "small",
                        fullWidth: true,
                        required: true
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Student Email"
                  type="email"
                  value={formData.studentEmail}
                  onChange={(e) => handleInputChange('student_email', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
            </Grid>
          </Box>

          {/* Academic Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              Academic Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="course-label">Course/Program</InputLabel>
                  <Select
                    labelId="course-label"
                    sx={{minWidth:'200px'}}
                    id="course-select"
                    value={formData.course}
                    label="Course/Program"
                    onChange={(e) => handleInputChange('course', e.target.value)}
                  >
                    {courses.map((course) => (
                      <MenuItem key={course} value={course}>{course}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="year-level-label">Year Level</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="year-level-label"
                    id="year-level-select"
                    value={formData.yearLevel}
                    label="Year Level"
                    onChange={(e) => handleInputChange('year_level', e.target.value)}
                  >
                    {yearLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={3}>
                <FormControl fullWidth size="small">
                  <InputLabel id="scholarship-label">Scholarship Status</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="scholarship-label"
                    id="scholarship-select"
                    value={formData.scholarshipStatus}
                    label="Scholarship Status"
                    onChange={(e) => handleInputChange('scholarship_status', e.target.value)}
                  >
                    {scholarshipOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          {/* Guardian Information */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              Guardian Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Father's Name"
                  value={formData.fatherName}
                  onChange={(e) => handleInputChange('father_name', e.target.value)}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Mother's Name"
                  value={formData.motherName}
                  onChange={(e) => handleInputChange('mother_name', e.target.value)}
                  size="small"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Contact"
                  value={formData.guardianContact}
                  onChange={(e) => handleInputChange('guardian_contact', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Guardian Email"
                  type="email"
                  value={formData.guardianEmail}
                  onChange={(e) => handleInputChange('guardian_email', e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Educational Background */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom color="primary">
              Educational Background
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Grid container spacing={2}>
              {/* Elementary School */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
                  Elementary School
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={formData.elementarySchool}
                  onChange={(e) => handleInputChange('elementary_school', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year Graduated"
                  value={formData.elementaryYearGraduated}
                  onChange={(e) => handleInputChange('elementary_year_graduated', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              
              {/* Junior High School */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                  Junior High School
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={formData.juniorHighSchool}
                  onChange={(e) => handleInputChange('junior_high_school', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year Graduated"
                  value={formData.juniorHighYearGraduated}
                  onChange={(e) => handleInputChange('junior_high_year_graduated', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              
              {/* Senior High School */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                  Senior High School
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={formData.seniorHighSchool}
                  onChange={(e) => handleInputChange('senior_high_school', e.target.value)}
                  size="small"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year Graduated"
                  value={formData.seniorHighYearGraduated}
                  onChange={(e) => handleInputChange('senior_high_year_graduated', e.target.value)}
                  size="small"
                  required
                />
              </Grid>              
              {/* Last School Attended */}
              <Grid item xs={12}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                  Other School Attended (if applicable)
                </Typography>
              </Grid>
              <Grid item xs={12} sm={8}>
                <TextField
                  fullWidth
                  label="School Name"
                  value={formData.lastSchoolAttended}
                  onChange={(e) => handleInputChange('last_school_attended', e.target.value)}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Year Last Attended"
                  value={formData.lastSchoolYearAttended}
                  onChange={(e) => handleInputChange('last_school_year_attended', e.target.value)}
                  size="small"
                />
              </Grid>
            </Grid>
          </Box>

          {/* Submit Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ px: 4 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Registration"}
            </Button>
          </Box>

          {/* Snackbar for messages */}
          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              onClose={() => setSnackbar({ ...snackbar, open: false })}
              severity={snackbar.severity}
              variant="filled"
              sx={{ width: "100%" }}
            >
              {snackbar.message}
            </Alert>
          </Snackbar>
        </form>
      </Paper>
    </Container>
  );
}