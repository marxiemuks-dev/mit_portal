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
  CircularProgress,
  DialogActions,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import CloseIcon from "@mui/icons-material/Close";
import RegistrationForm from "../../components/RegistrationForm";
import { getAllStudents } from "../../actions/student";
import { useDispatch } from "react-redux";
import { getAllSubjectOffering } from "../../actions/subjectOffering";
import { enrollStudent } from "../../actions/enrollment";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Enroll() {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [openRegister, setOpenRegister] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [subjectToEnroll, setSubjectToEnroll] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubjectToEnroll, setSelectedSubjectToEnroll] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [loading, setLoading] = useState(true);

  function RegistrationFormPopUp({ onClose }) {
  return (
    <Box sx={{ p: 2, bgcolor: "#fff" }}>
      <RegistrationForm onClose={() => setOpenRegister(false)}/>
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

  const semesters = ["1st Semester", "2nd Semester", "Summer"];
  const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];
  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    units: "",
    teacher: "",
    schedule: "",
    room: "",
    semester: "",
    school_year: "",
  });
  // DataGrid columns
  const columns = [
    { field: "subject_code", headerName: "Code", flex: 1 },
    { field: "subject_name", headerName: "Subject", flex: 2 },
    { field: "units", headerName: "Unit", flex: 1 },
    { field: "semester", headerName: "Semester", flex: 1 },
    { field: "year", headerName: "School Year", flex: 1 },
       {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <IconButton
          color="error"
          onClick={() => handleRemove(params.row.id)}
        >
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
    const handleRemove = (id) => {
    setSelectedSubjectToEnroll((prev) =>
      prev.filter((subject) => subject.id !== id)
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSubject = () => {
    if (
      !formData.subject_code ||
      !formData.subject_name ||
      !formData.units ||
      !formData.teacher ||
      !formData.schedule ||
      !formData.room ||
      !formData.semester ||
      !formData.school_year
    ) {
      alert("Please fill in all fields before adding a subject.");
      return;
    }

    if (
      selectedSubjectToEnroll.some(
        (item) => item.subject_code === formData.subject_code
      )
    ) {
      alert("Subject already exists!");
      return;
    }

    const newSubject = {
      ...formData,
      id: selectedSubjectToEnroll.length + 1,
    };

    setSelectedSubjectToEnroll((prev) => [...prev, newSubject]);

    // reset form + close dialog
    setFormData({
      subject_code: "",
      subject_name: "",
      units: "",
      teacher: "",
      schedule: "",
      room: "",
      slots: "",
    });
    setOpenDialog(false);
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

  const columnFees = [
    { field: "description", headerName: "Description", flex: 1 },
    { field: "fee", headerName: "Fee", editable: true, flex: 2 },
  ];
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
      console.log(selectedStudent)
  },[selectedStudent])

  useEffect(() => {
    fetchApplicant();
    fetchOffering();
  },[])

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
    try{
      if (!selectedStudent || !subjectToEnroll) return;

      const studentId = selectedStudent.id;
      const subjectOfferingId = subjectToEnroll.id;

      setLoading(true)
      const response = await dispatch(enrollStudent(studentId, subjectOfferingId));
      if (response.status === true) {
        alert("Enrollment successful!");
        setSubjectToEnroll(null);
        setSelectedStudent(null);
        setLoading(false)
      } else {
        alert("Failed: " + response.message);
        setLoading(false)
      }
    } catch(error){
       alert("Failed: " + error);
        setLoading(false)
    } finally {
      setLoading(false)
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
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
                Register New Student
              </Button>
            </Box>
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
            <Box sx={{ flex: { xs: "1 1 100%", sm: "1 1 30%" } }}>
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
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
          <Box p={3} sx={{ backgroundColor: "#fff", borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom>
              CERTIFICATE OF ENROLLMENT AND BILLING
            </Typography>
            <Grid container spacing={2}>
              <Grid item sm={6} md={6} flex={4}>
                <TextField
                  select
                  fullWidth
                  label="Semester"
                  value={selectedSemester}
                  onChange={(e) => setSelectedSemester(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {semesters.map((sem, idx) => (
                    <MenuItem key={idx} value={sem}>
                      {sem}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item sm={6} md={6} flex={4}>
                <TextField
                  select
                  fullWidth
                  label="School Year"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  sx={{ mb: 2 }}
                >
                  {schoolYears.map((yr, idx) => (
                    <MenuItem key={idx} value={yr}>
                      {yr}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item sm={6} flex={2}>
                <Button
                  fullWidth
                  onClick={() => setOpenDialog(true)}
                  variant="contained"
                  color="primary"
                  sx={{ mb: 2, height: "56px", width:'100%' }}
                >
                  Add Subject
                </Button>
              </Grid>
            </Grid>

            <div style={{ height: 400, width: "100%", marginBottom:10 }}>
              <DataGrid
                rows={selectedSubjectToEnroll}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
              />
            </div>
            <Typography variant="h6" gutterBottom>
              CERTIFICATE OF ENROLLMENT AND BILLING
            </Typography>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rows={selectedCourses}
                columns={columnFees}
                pageSize={5}
                
                rowsPerPageOptions={[5]}
                onRowClick={(params) => {
                  setSubjectToEnroll(params.row);
                  console.log("Selected subject:", params.row);
                }}
                sx={{width:{sm:'100%', lg:'70%'}}}
              />
            </div>
          </Box>
          <Divider sx={{ my: 2 }} />
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>Add Subject</DialogTitle>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Subject Code"
                  name="subject_code"
                  fullWidth
                  value={formData.subject_code}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Description"
                  name="subject_name"
                  fullWidth
                  value={formData.subject_name}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Units"
                  type="number"
                  name="units"
                  fullWidth
                  value={formData.units}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Semester"
                  name="semester"
                  fullWidth
                  value={formData.semester}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="School Year"
                  name="school_year"
                  fullWidth
                  value={formData.school_year}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Teacher"
                  name="teacher"
                  fullWidth
                  value={formData.teacher}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Schedule"
                  name="schedule"
                  fullWidth
                  value={formData.schedule}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Room"
                  name="room"
                  fullWidth
                  value={formData.room}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button variant="contained" color="primary" onClick={handleAddSubject}>
              Add
            </Button>
          </DialogActions>
        </Dialog>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleEnroll}
            disabled={!subjectToEnroll || !selectedStudent || loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Enroll Now'}
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}
