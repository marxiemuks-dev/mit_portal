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
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { deleteEnrollment, getAllEnrollments, updateEnrollment } from "../../actions/enrollment";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function Enrolled() {
  const [enrollments, setEnrollments] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 filters with default values
  const [yearLevelFilter, setYearLevelFilter] = useState("All Year Level");
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
    "Bachelor of Science in Business Administration",
    "Bachelor of Science in Criminology",
    "Bachelor of Science in Elementary Education",
    "Bachelor of Science in Engineering",
    "Bachelor of Science in Information Technology",
    "Bachelor of Science in Nursing",
    "Bachelor of Science in Social Work",
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
  const enrollmentCopy = { ...enrollment };

  setSelectedEnrollment(enrollmentCopy);

  setEditDialogOpen(true);
};
const handleDeleteClick = async (enrollment) => {
  const enrollmentCopy = { ...enrollment };
  console.log(enrollmentCopy)
  try{
    const result = await dispatch(deleteEnrollment(enrollmentCopy.id))
    console.log(result)
  }catch(error){

  }finally{
    fetchEnrollments()
  }
};

  const handleEditChange = (field, value) => {
    setSelectedEnrollment((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = async () => {
    try{
          if (!selectedEnrollment) return;

          setLoading(true)
          const response = await dispatch(updateEnrollment(selectedEnrollment));
          console.log(response)
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
    }catch(error){
       setMessage("Failed to update enrollment: " + error);
      setSeverity("error");
      setOpen(true);
    }finally{
      setLoading(false)
    }
  };
  // ✅ Filter enrollments by semester, school year, and course
  const filteredEnrollments = enrollments.filter(
    (en) =>
      en.current_semester === semesterFilter &&
      en.current_school_year === schoolYearFilter &&
      (yearLevelFilter === "All Year Level" || en.current_year_level === yearLevelFilter) &&
      (courseFilter === "All Courses" || en.current_course === courseFilter)
  );
  
const handlePrint = () => {
  if (filteredEnrollments.length === 0) {
    alert("Nothing to print!");
    return;
  }

  const doc = new jsPDF("p", "pt", "a4");

  // ---------------- Title ----------------
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("Enrollment List", 297.5, 40, { align: "center" });

  // ---------------- Info ----------------
  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  const infoText = `Semester: ${semesterFilter} | School Year: ${schoolYearFilter}${
    courseFilter !== "All Courses" ? " | Course: " + courseFilter : ""
  }`;
  doc.text(infoText, 297.5, 60, { align: "center" });

  doc.text(`Total Students: ${filteredEnrollments.length}`, 297.5, 75, { align: "center" });

  // ---------------- Table ----------------
  const tableColumn = [
    "#",
    "Student No",
    "Student Name",
    "Course",
    "Year Level",
    "Semester",
    "School Year",
    "Status",
  ];

  const tableRows = filteredEnrollments.map((en, idx) => [
    idx + 1,
    en.students?.student_no || "",
    `${en.students?.first_name || ""} ${en.students?.last_name || ""}`,
    en.current_course || "",
    en.current_year_level || "",
    en.current_semester || "",
    en.current_school_year || "",
    en.enrollment_status || "",
  ]);

  doc.autoTable({
    startY: 90,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    headStyles: {
      fillColor: [63, 81, 181],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      fontSize: 10,
      textColor: 20,
      halign: "center",
      valign: "middle",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      2: { halign: "left" },
      3: { halign: "left" },
    },
    margin: { left: 20, right: 20 },
    tableWidth: "auto",
  });

  // ---------------- Footer ----------------
  const date = new Date();
  const formattedDate = date.toLocaleDateString() + " " + date.toLocaleTimeString();
  doc.setFontSize(10);
  doc.text(`Generated on: ${formattedDate}`, 20, doc.internal.pageSize.height - 20);

  // AUTO PRINT PDF
  const pdfBlob = doc.output("blob");
  const pdfURL = URL.createObjectURL(pdfBlob);

  const printWindow = window.open(pdfURL);

  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
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

      <Box display="flex" alignItems="center" mb={2}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h6" ml={1}>
          Back
        </Typography>
      </Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Student Record
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
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Year Level</InputLabel>
          <Select
            value={yearLevelFilter}
            onChange={(e) => setYearLevelFilter(e.target.value)}
            label="Year Level"
          >
            <MenuItem value="All Year Level">All Year Level</MenuItem>
            {yearLevels.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
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
                  <TableCell align="center">Action</TableCell>
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
                    <TableCell align="center">
                      <Button
                        color="contained"
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <IconButton onClick={()=>{handleEditClick(en)}} color="primary" size="small" title="Edit">
                          <EditIcon />
                        </IconButton>
                        </Button>
                        <Button
                          color="error"
                          size="small"
                        >
                          <IconButton onClick={()=>{handleDeleteClick(en)}} color="primary" size="small" title="Delete">
                            <DeleteIcon />
                          </IconButton>
                        </Button>
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
