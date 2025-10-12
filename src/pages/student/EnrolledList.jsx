import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { getAllEnrollments, updateEnrollment } from "../../actions/enrollment";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function EnrolledList() {
  const [enrollments, setEnrollments] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 filters with default values
  const [semesterFilter, setSemesterFilter] = useState("1st Semester");
  const [schoolYearFilter, setSchoolYearFilter] = useState("2024-2025");
  const [courseFilter, setCourseFilter] = useState("All Courses"); // ✅ NEW

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const yearLevels = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const semesters = ["1st Semester", "2nd Semester", "Summer"];
  const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];

  // Options for dropdowns
  const courses = [
    "Bachelor of Science in Elementary Education",
    "Bachelor of Science in Criminology",
    "Bachelor of Science in Engineering",
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Nursing",
    "HRM (Hotel and Restaurant Management)",
  ];

  const fetchEnrollments = async () => {
    const result = await dispatch(getAllEnrollments());
    if (result.status === true) {
      setEnrollments(result.data);
    } else {
      setMessage("Failed to load enrollments");
      setSeverity("error");
      setOpen(true);
    }
  };

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const handleEditClick = (enrollment) => {
    setSelectedEnrollment({ ...enrollment });
    setEditDialogOpen(true);
  };

  const handleEditChange = (field, value) => {
    setSelectedEnrollment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {

    if (!selectedEnrollment) return;

    setLoading(true)
    const response = await dispatch(updateEnrollment(selectedEnrollment));
    if (response.status === true) {
      setMessage("Enrollment updated successfully!");
      setSeverity("success");
      setOpen(true);
      setLoading(false)
      setEditDialogOpen(false);
      fetchEnrollments(); // refresh list
    } else {
      setMessage("Failed to update enrollment: " + response.message);
      setSeverity("error");
      setOpen(true);
      setLoading(false)
    }
  };

  // ✅ Filter enrollments by semester, school year, and course
  const filteredEnrollments = enrollments.filter(
    (en) =>
      en.current_semester === semesterFilter &&
      en.current_school_year === schoolYearFilter &&
      (courseFilter === "All Courses" || en.current_course === courseFilter)
  );
  const handlePrint = () => {
  const printContent = document.getElementById("print-area");
  if (!printContent) {
    alert("Nothing to print!");
    return;
  }

  const newWin = window.open("", "", "width=900,height=650");
  newWin.document.write(`
    <html>
      <head>
        <title>Enrollment List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1, h2, h3 {
            text-align: center;
            margin: 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #333;
            padding: 8px;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
          }
          .info {
            margin-top: 10px;
            text-align: center;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>Enrollment List</h2>
          <div class="info">
            Semester: ${semesterFilter} | School Year: ${schoolYearFilter} 
            ${courseFilter !== "All Courses" ? `| Course: ${courseFilter}` : ""}
          </div>
          <div class="info">Total Students: ${filteredEnrollments.length}</div>
        </div>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  newWin.document.close();
  newWin.print();
};


  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
        <Alert
          onClose={() => setOpen(false)}
          severity={severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>

      {/* Back Button */}
      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          Back
        </Typography>
      </Box>

      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Enrolled Students
      </Typography>

      {/* 🔹 Filters */}
      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Semester</InputLabel>
          <Select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} label="Semester">
            {semesters.map((sem) => (
              <MenuItem key={sem} value={sem}>
                {sem}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>School Year</InputLabel>
          <Select
            value={schoolYearFilter}
            onChange={(e) => setSchoolYearFilter(e.target.value)}
            label="School Year"
          >
            {schoolYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* ✅ New Course Filter */}
        <FormControl sx={{ minWidth: 250 }}>
          <InputLabel>Course</InputLabel>
          <Select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            label="Course"
          >
            <MenuItem value="All Courses">All Courses</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course} value={course}>
                {course}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Table
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ bgcolor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell>Student No</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Year Level</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>School Year</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredEnrollments.map((en) => (
                  <TableRow key={en.id}>
                    <TableCell>{en.students?.student_no}</TableCell>
                    <TableCell>
                      {en.students?.first_name} {en.students?.last_name}
                    </TableCell>
                    <TableCell>{en.current_course}</TableCell>
                    <TableCell>{en.current_year_level}</TableCell>
                    <TableCell>{en.current_semester}</TableCell>
                    <TableCell>{en.current_school_year}</TableCell>
                    <TableCell>{en.enrollment_status}</TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => handleEditClick(en)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEnrollments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} align="center">
                      No enrollments found for {semesterFilter}, {schoolYearFilter}
                      {courseFilter !== "All Courses" && `, ${courseFilter}`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="subtitle1">
              Total Students: {filteredEnrollments.length}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              onClick={() => window.print()}
            >
              Print List
            </Button>
          </Box>

        </CardContent>
      </Card> */}
      <Card id="print-area">  {/* ✅ Added id here */}
  <CardContent>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box>
        <Typography variant="h5" fontWeight="bold">Enrollment List</Typography>
        <Typography variant="body2" color="text.secondary">
          Semester: {semesterFilter} | School Year: {schoolYearFilter} 
          {courseFilter !== "All Courses" && ` | Course: ${courseFilter}`}
        </Typography>
      </Box>
      <Typography variant="subtitle1" color="text.secondary">
        Total Students: {filteredEnrollments.length}
      </Typography>
    </Box>

    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Student No</TableCell>
            <TableCell>Student Name</TableCell>
            <TableCell>Course</TableCell>
            <TableCell>Year Level</TableCell>
            <TableCell>Semester</TableCell>
            <TableCell>School Year</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEnrollments.map((en, idx) => (
            <TableRow key={en.id} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{en.students?.student_no}</TableCell>
              <TableCell>
                {en.students?.first_name} {en.students?.last_name}
              </TableCell>
              <TableCell>{en.current_course}</TableCell>
              <TableCell>{en.current_year_level}</TableCell>
              <TableCell>{en.current_semester}</TableCell>
              <TableCell>{en.current_school_year}</TableCell>
              <TableCell>{en.enrollment_status}</TableCell>
            </TableRow>
          ))}
          {filteredEnrollments.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center">
                No enrollments found for {semesterFilter}, {schoolYearFilter}
                {courseFilter !== "All Courses" && `, ${courseFilter}`}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
      <Button variant="contained" color="primary" onClick={handlePrint} sx={{mt:2}}>
        Print List
      </Button>
  </CardContent>
</Card>


      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Edit Enrollment
          <IconButton
            aria-label="close"
            onClick={() => setEditDialogOpen(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedEnrollment && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {/* Course Dropdown */}
              <FormControl fullWidth>
                <InputLabel>Course</InputLabel>
                <Select
                  value={selectedEnrollment.current_course}
                  onChange={(e) => handleEditChange("current_course", e.target.value)}
                >
                  {courses.map((course) => (
                    <MenuItem key={course} value={course}>
                      {course}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Year Level Dropdown */}
              <FormControl fullWidth>
                <InputLabel>Year Level</InputLabel>
                <Select
                  value={selectedEnrollment.current_year_level}
                  onChange={(e) => handleEditChange("current_year_level", e.target.value)}
                >
                  {yearLevels.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Semester Dropdown */}
              <FormControl fullWidth>
                <InputLabel>Semester</InputLabel>
                <Select
                  value={selectedEnrollment.current_semester}
                  onChange={(e) => handleEditChange("current_semester", e.target.value)}
                >
                  {semesters.map((sem) => (
                    <MenuItem key={sem} value={sem}>
                      {sem}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* School Year Dropdown */}
              <FormControl fullWidth>
                <InputLabel>School Year</InputLabel>
                <Select
                  value={selectedEnrollment.current_school_year}
                  onChange={(e) => handleEditChange("current_school_year", e.target.value)}
                >
                  {schoolYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Enrollment Status Dropdown */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={selectedEnrollment.enrollment_status}
                  onChange={(e) => handleEditChange("enrollment_status", e.target.value)}
                >
                  <MenuItem value="Officially Enrolled">Officially Enrolled</MenuItem>
                  <MenuItem value="Not Officially Enrolled">Not Officially Enrolled</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={() => setEditDialogOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSaveEdit} disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
