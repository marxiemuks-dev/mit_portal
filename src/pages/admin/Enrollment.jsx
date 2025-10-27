import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  MenuItem,
  TextField,
  Divider,
  Autocomplete,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Select,
  InputLabel,
  FormControl,
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RegistrationForm from "../../components/RegistrationForm";
import { getAllStudents } from "../../actions/student";
import { useDispatch } from "react-redux";
import { getAllSubjectOffering } from "../../actions/subjectOffering";
import { enrollStudent } from "../../actions/enrollment";
import EnrolledList from "./EnrolledList";
import { useNavigate } from "react-router-dom";

export default function Enroll() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openRegister, setOpenRegister] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [subjectToEnroll, setSubjectToEnroll] = useState([]);
  const [selectedSubjectToEnroll, setSelectedSubjectToEnroll] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function RegistrationFormPopUp({ onClose }) {
    return (
      <Box sx={{ p: 2, bgcolor: "#fff" }}>
        <RegistrationForm setOpenRegister ={setOpenRegister}/>
        <Divider sx={{ my: 2 }} />
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={onClose}
        >
          Close
        </Button>
      </Box>
    );
  }
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
  const enrollmentStatus = ["Offically Enrolled", "Not Officially Enrolled"];
  const [formDataToEnroll, setFormDataToEnrolled] = useState({
    studentID: '',
    currentCourse: '',
    currentYearLevel:'',
    currentSemester:'',
    currentSchoolYear: '',
    enrollmentStatus:'',
    guardianEmail:'',
    studentEmail:''
  });
  const handleInputChange = (field, value) => {
    setFormDataToEnrolled(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (subjectData.length === 0) return;
    setSelectedSubjectToEnroll((prev) => {
      // Merge and remove duplicates by `id`
      const merged = [...prev, ...subjectData];
      const unique = merged.filter(
        (item, index, self) => index === self.findIndex((s) => s.id === item.id)
      );
      return unique;
    });
  }, [subjectData]);

  const dispatch = useDispatch();

  const fetchApplicant = async () => {
    const result = await dispatch(getAllStudents());
    console.log(result);

    if (result.status === true) {
      const names = result.data.map((s) => ({
        id: s.id, // keep the student id
        label: `${s.student_no} | ${s.first_name} ${s.last_name} | ${s.course}`,
        studentNo: s.student_no,
        lastName: s.last_name,
        firstName: s.first_name,
        middleName: s.middle_name,
        extName: s.extension_name,
        gender: s.gender,
        lrn: s.lrn,
        guardianEmail: s.guardian_email,
        studentEmail: s.student_email
      }));
      setStudentList(names);
    } else {
      console.log(result.status);
    }
  };

  const fetchOffering = async () => {
    const result = await dispatch(getAllSubjectOffering());

    if (result.status === true) {
      const formatted = result.data.map((item) => ({
        id: item.id,
        code: item.subject_code || "-",
        name: item.subject_name || "-",
        semester: item.semester,
        year: item.school_year,
        slots: item.slots,
      }));

      setAllCourses(formatted);
      setSelectedCourses(formatted); // initially show all
    }
  };

  useEffect(() => {
    fetchApplicant();
    fetchOffering();
  },[openRegister])

  useEffect(() => {
    let filtered = allCourses;

    if (selectedSemester) {
      filtered = filtered.filter((c) => c.semester === selectedSemester);
    }

    if (selectedYear) {
      filtered = filtered.filter((c) => c.year === selectedYear);
    }

    setSelectedCourses(filtered);
  }, [selectedSemester, selectedYear, allCourses]);

  const handleEnroll = async () => {

    setLoading(true)
    if (!selectedStudent 
        || formDataToEnroll.enrollmentStatus === ''
        || formDataToEnroll.currentCourse === ''
        || formDataToEnroll.currentYearLevel === ''
        || formDataToEnroll.currentSemester === ''
        || formDataToEnroll.currentSchoolYear === ''
        || formDataToEnroll.enrollmentStatus === ''
       ){
        setSeverity("warning")
        setMessage("All field is required!")
        handleClick()
        setLoading(false)
        return;
       };
    
    setFormDataToEnrolled((prev) => ({
      ...prev,
      studentID: selectedStudent.id,
      studentEmail: selectedStudent.studentEmail,
      guardianEmail: selectedStudent.guardianEmail
    }));

    const response = await dispatch(enrollStudent(formDataToEnroll.studentID,formDataToEnroll.currentCourse,formDataToEnroll.currentYearLevel,
                    formDataToEnroll.currentSemester,formDataToEnroll.currentSchoolYear,formDataToEnroll.enrollmentStatus,formDataToEnroll.guardianEmail,formDataToEnroll.studentEmail));
    console.log(response)
    
    if (response.status === true) {
      setMessage("Enrollment successful!");
      setSeverity("success")
      handleClick()
      setSubjectToEnroll(null);
      setSelectedStudent(null);
      setLoading(false)
    } else {
      setMessage("Failed: " + response.message);
      setSeverity("warning")
      handleClick()
      setLoading(false)
    }
  };

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = useState('')
  const [severity, setSeverity] = useState('')

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <Box>
      <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Enrollment
      </Typography>
      {/* 🔹 Registration Form Popup */}
      <Dialog open={openRegister} onClose={() => setOpenRegister(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Register Student
          <IconButton
            aria-label="close"
            onClick={() => setOpenRegister(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <RegistrationFormPopUp onClose={() => setOpenRegister(false)} />
        </DialogContent>
      </Dialog>
      {/* Enrollment Form */}
      <Card sx={{ p: 2, mb: 3 }}>
        <CardContent>
          <Box sx={{display:"flex", flexDirection:'row', alignItems: "flex-end", gap: 2}}>
            <Box sx={{flex: 7}}>
              <Typography variant="h6" gutterBottom>
                Search Student
              </Typography>
              <Autocomplete
                options={studentList}
                value={selectedStudent}
                onChange={(e, newValue) => setSelectedStudent(newValue)}
                getOptionLabel={(option) => option.label || ""} // show label in UI
                renderInput={(params) => (
                  <TextField {...params} label="Search student" fullWidth />
                )}
                sx={{ mb: 2 }}
              />
            </Box>
            <Box sx={{ flex: 2}}>
              <Button
                variant="contained"
                color="primary"
                sx={{ mb: 2, height: "56px", width:'100%' }}
                onClick={() => setOpenRegister(true)}
              >
                Register Student
              </Button>
            </Box>
            {/* <Box sx={{flex: 2}}>
              <Button 
                variant="contained" 
                color="primary"
                sx={{ mb: 2, height: "56px", width:'100%' }}
                onClick={() => navigate("/list")}
              >
                View Enrollment List
              </Button>
            </Box> */}
          </Box>
          <Box
            sx={{
              p:'10px',
              display: "flex",
              flexWrap: "wrap",
              gap: 2, // space between fields
            }}
          >   
          <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 100%" } }}>
            <Typography variant="h6" gutterBottom>
                Selected Student
            </Typography>
            </Box>          
            {/* Student No */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <TextField
                fullWidth
                label="Student No."
                value={selectedStudent ? selectedStudent.studentNo : ""}
                size="small"
                required
                disabled
              />
            </Box>
            {/* LRN */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <TextField
                fullWidth
                label="LRN (Learner Reference Number)"
                value={selectedStudent ? selectedStudent.lrn : ""}
                size="small"
                inputProps={{ maxLength: 12 }}
                placeholder="12-digit number"
                required
                disabled
              />
            </Box>
            {/* Last Name */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <TextField
                fullWidth
                label="Last Name"
                value={selectedStudent ? selectedStudent.lastName : ""}
                size="small"
                required
                disabled
              />
            </Box>
            {/* First Name */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <TextField
                fullWidth
                label="First Name"
                value={selectedStudent ? selectedStudent.firstName : ""}
                size="small"
                required
                disabled
              />
            </Box>
            {/* Middle Name */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <TextField
                fullWidth
                label= "Middle Name"
                value={selectedStudent ? selectedStudent.middleName : ""}
                size="small"
                disabled
              />
            </Box>
            {/* Extension Name */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <TextField
                fullWidth
                label="Extension Name (e.g. Jr., Sr., III)"
                value={selectedStudent ? selectedStudent.extName : ""}
                size="small"
                placeholder="e.g. Jr., Sr., III"
                disabled
              />
            </Box>
            {/* Gender */}
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <FormControl fullWidth size="small" required disabled>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender-select"
                  value={selectedStudent ? selectedStudent.gender : ""}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <FormControl fullWidth size="small" required>
                <InputLabel id="course-label">Current Course</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender-select"
                  value={formDataToEnroll.course}
                  label="Current Course"
                  onChange={(e) => handleInputChange('currentCourse', e.target.value)}
                >
                  {courses.map((course) => (
                    <MenuItem key={course} value={course}>{course}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <FormControl fullWidth size="small" required>
                  <InputLabel id="year-level-label">Current Year Level</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="year-level-label"
                    id="year-level-select"
                    value={formDataToEnroll.yearLevel}
                    label="Year Level"
                    onChange={(e) => handleInputChange('currentYearLevel', e.target.value)}
                  >
                    {yearLevels.map((level) => (
                      <MenuItem key={level} value={level}>{level}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <FormControl fullWidth size="small" required>
                  <InputLabel id="year-level-label">Current Semester</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="year-level-label"
                    id="year-level-select"
                    value={formDataToEnroll.yearLevel}
                    label="Semester"
                    onChange={(e) => handleInputChange('currentSemester', e.target.value)}
                  >
                    {semesters.map((sem) => (
                      <MenuItem key={sem} value={sem}>{sem}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
              <FormControl fullWidth size="small" required>
                  <InputLabel id="year-level-label">Current School Year</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="year-level-label"
                    id="year-level-select"
                    value={formDataToEnroll.yearLevel}
                    label="School Year"
                    onChange={(e) => handleInputChange('currentSchoolYear', e.target.value)}
                  >
                    {schoolYears.map((sYear) => (
                      <MenuItem key={sYear} value={sYear}>{sYear}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Box>
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 45%" } }}>
                <FormControl fullWidth size="small" required>
                  <InputLabel id="year-level-label">Enrollment Status</InputLabel>
                  <Select
                    sx={{minWidth:'200px'}}
                    labelId="year-level-label"
                    id="year-level-select"
                    value={formDataToEnroll.enrollmentStatus}
                    label=">Enrollment Status"
                    onChange={(e) => handleInputChange('enrollmentStatus', e.target.value)}
                  >
                    {enrollmentStatus.map((eStatus) => (
                      <MenuItem key={eStatus} value={eStatus}>{eStatus}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
            </Box>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEnroll}
            disabled={!selectedStudent || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Now'}
          </Button>
        </CardActions>
      </Card>
    </Box>
    </Box>
  );
}
