import React, { useState, useEffect } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Add } from "@mui/icons-material";
import axiosInstance from "../../API/AXIOS_INSTANCE"
import { useDispatch } from "react-redux";
import { addSchedule, getAllSchedule } from "../../actions/schedule";
// mock data for courses, semesters, etc.
  const courses = [
    'Bachelor of Science in Elementary Education',
    'Bachelor of Science in Criminology',
    'Bachelor of Science in Engineering',
    'Bachelor of Science in Information Technology',
    'Bachelor of Science in Nursing',
    'HRM (Hotel and Restaurant Management)'
  ];

const semesters = ["1st Semester", "2nd Semester"];
const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const [filterCourse, setFilterCourse] = useState("All Courses");
  const [filterSemester, setFilterSemester] = useState(semesters[0]);
  const [filterSchoolYear, setFilterSchoolYear] = useState(schoolYears[0]);
  const [facultyList, setFacultyList] = useState([]); // 👈 instructors list
  const [newSchedule, setNewSchedule] = useState({
    course: courses[0],
    semester: semesters[0],
    schoolYear: schoolYears[0],
    subjectCode: "",
    descriptiveTitle: "",
    units: "",
    time: "",
    day: "",
    room: "",
    instructor: "",
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      const result = await dispatch(getAllSchedule())
      console.log(result)
      const formattedSchedules = result.data.map((s) => ({
        id: s.schedule_id, // 👈 give DataGrid a proper id
        subjectCode: s.subject_code,
        descriptiveTitle: s.desc_title,
        units: s.units,
        time: s.time,
        day: s.day,
        room: s.room,
        instructor: s.instructor_name, // if you included name in API
        course: s.course,
        semester: s.semester,
        schoolYear: s.school_year,
      }));

      setSchedules(formattedSchedules);
    }

    fetchSchedule()
  }, [newSchedule,loading]);
  
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const res = await axiosInstance.get("http://127.0.0.1:5000/api/auth/faculty");
        if (res.data.status === "success") {
          const formatted = res.data.data.map((f) => ({
            label: `${f.first_name} ${f.middle_name ? f.middle_name + " " : ""}${f.last_name}`,
            value: f.id,
          }));
          setFacultyList(formatted);
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
      }
    };
    fetchFaculty();
  }, []);

  const handleOpenDialog = (schedule = null) => {
    setSelectedSchedule(schedule);
    if (schedule) {
      setNewSchedule(schedule);
    } else {
      setNewSchedule({
        course: courses[0],
        semester: semesters[0],
        schoolYear: schoolYears[0],
        subjectCode: "",
        descriptiveTitle: "",
        units: "",
        time: "",
        day: "",
        room: "",
        instructor: "",
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedSchedule(null);
  };

const handleSaveSchedule = async () => {
  setLoading(true);
  try {
    const {
      course,
      semester,
      schoolYear,
      subjectCode,
      descriptiveTitle,
      units,
      time,
      day,
      room,
      instructor,
    } = newSchedule;
    const response = await dispatch(
      addSchedule(
        course,
        semester,
        schoolYear,
        subjectCode,
        descriptiveTitle,
        units,
        time,
        day,
        room,
        instructor
      )
    );
    if (response?.status === "success" || response?.status === true) {
      // ✅ Update UI with the new schedule
      if (selectedSchedule) {
        setSchedules((prev) =>
          prev.map((s) =>
            s.id === selectedSchedule.id ? { ...newSchedule, id: s.id } : s
          )
        );
      } else {
        setSchedules((prev) => [
          ...prev,
          { ...newSchedule, id: prev.length + 1 },
        ]);
      }

      // ✅ Show success snackbar
      setSnackbar({
        open: true,
        message: selectedSchedule
          ? "Schedule updated successfully!"
          : "Schedule added successfully!",
        severity: "success",
      });
    } else {
      throw new Error(response?.message || "Failed to save schedule");
    }
  } catch (error) {
    console.error("Save schedule error:", error);
    setSnackbar({
      open: true,
      message: "Failed to save schedule. Please try again.",
      severity: "error",
    });
  } finally {
    setLoading(false);
    handleCloseDialog();
  }
};


const filteredSchedules = schedules.filter(
  (s) =>
    (filterCourse === "All Courses" || s.course === filterCourse) &&
    s.semester === filterSemester &&
    s.schoolYear === filterSchoolYear
);

  const handlePrint = () => {
  const printContent = document.getElementById("print-area").innerHTML;
  const printWindow = window.open("", "", "width=900,height=700");
  printWindow.document.write(`
    <html>
      <head>
        <title>Class Schedule</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          h2 { text-align: center; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #555; padding: 8px; text-align: center; }
          th { background-color: #f0f0f0; }
        </style>
      </head>
      <body>
        <h2>Class Schedule - ${filterSemester} (${filterSchoolYear})</h2>
        <h3 style="text-align:center;">${filterCourse === "All Courses" ? "All Courses" : filterCourse}</h3>
        ${printContent}
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
};


  return (
    <Box p={3} sx={{ bgcolor: "#f4f6f8" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Schedule Management
      </Typography>

      {/* Filters */}
      <Box display="flex" gap={2} mb={2}>
        <Select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
          <MenuItem value="All Courses">All Courses</MenuItem>
          {courses.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
        <Select value={filterSemester} onChange={(e) => setFilterSemester(e.target.value)}>
          {semesters.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
        <Select value={filterSchoolYear} onChange={(e) => setFilterSchoolYear(e.target.value)}>
          {schoolYears.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </Box>
      <Card id="print-area" sx={{ mt: 4, p: 2 }}>
  <CardContent>
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      mb={2}
    >
      <Typography variant="h6">
        Class Schedule
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Total Subjects: {filteredSchedules.length}
      </Typography>
    </Box>

    <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
      <Table>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Subject Code</TableCell>
            <TableCell>Descriptive Title</TableCell>
            <TableCell>Units</TableCell>
            <TableCell>Time</TableCell>
            <TableCell>Day</TableCell>
            <TableCell>Room</TableCell>
            <TableCell>Instructor</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredSchedules.map((row, idx) => (
            <TableRow key={idx} hover>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{row.subjectCode}</TableCell>
              <TableCell>{row.descriptiveTitle}</TableCell>
              <TableCell>{row.units}</TableCell>
              <TableCell>{row.time}</TableCell>
              <TableCell>{row.day}</TableCell>
              <TableCell>{row.room}</TableCell>
              <TableCell>{row.instructor}</TableCell>
            </TableRow>
          ))}
          {filteredSchedules.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} align="center" sx={{ py: 3 }}>
                <Typography color="text.secondary">
                  No schedule data available
                </Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  </CardContent>
</Card>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ mb: 2, mt:2}}
          onClick={() => handlePrint()}
        >
          🖨️ Print Schedule
        </Button>


      {/* Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedSchedule ? "Edit Schedule" : "Add Schedule"}
        </DialogTitle>
        <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
          {/* Course */}
          <TextField
            label="Course"
            select
            fullWidth
            value={newSchedule.course}
            onChange={(e) => setNewSchedule({ ...newSchedule, course: e.target.value })}
          >
            {courses.map((course, idx) => (
              <MenuItem key={idx} value={course}>
                {course}
              </MenuItem>
            ))}
          </TextField>

          {/* Semester */}
          <TextField
            label="Semester"
            select
            fullWidth
            value={newSchedule.semester}
            onChange={(e) => setNewSchedule({ ...newSchedule, semester: e.target.value })}
          >
            {semesters.map((sem, idx) => (
              <MenuItem key={idx} value={sem}>
                {sem}
              </MenuItem>
            ))}
          </TextField>

          {/* School Year */}
          <TextField
            label="School Year"
            select
            fullWidth
            value={newSchedule.schoolYear}
            onChange={(e) => setNewSchedule({ ...newSchedule, schoolYear: e.target.value })}
          >
            {schoolYears.map((sy, idx) => (
              <MenuItem key={idx} value={sy}>
                {sy}
              </MenuItem>
            ))}
          </TextField>

          {/* Subject Code */}
          <TextField
            label="Subject Code"
            fullWidth
            value={newSchedule.subjectCode}
            onChange={(e) => setNewSchedule({ ...newSchedule, subjectCode: e.target.value })}
          />

          {/* Descriptive Title */}
          <TextField
            label="Descriptive Title"
            fullWidth
            value={newSchedule.descriptiveTitle}
            onChange={(e) => setNewSchedule({ ...newSchedule, descriptiveTitle: e.target.value })}
          />

          {/* Units */}
          <TextField
            label="Units"
            type="number"
            fullWidth
            value={newSchedule.units}
            onChange={(e) => setNewSchedule({ ...newSchedule, units: e.target.value })}
          />

          {/* Time */}
          <TextField
            label="Time"
            placeholder="e.g. 08:00 AM - 10:00 AM"
            fullWidth
            value={newSchedule.time}
            onChange={(e) => setNewSchedule({ ...newSchedule, time: e.target.value })}
          />

          {/* Day */}
          <TextField
            label="Day"
            placeholder="e.g. M or MW"
            fullWidth
            value={newSchedule.day}
            onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
          />

          {/* Room */}
          <TextField
            label="Room"
            fullWidth
            value={newSchedule.room}
            onChange={(e) => setNewSchedule({ ...newSchedule, room: e.target.value })}
          />

          {/* Instructor */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Instructor
            </Typography>
            <Autocomplete
              options={facultyList}
              value={facultyList.find((f) => f.value === newSchedule.instructor) || null}
              onChange={(e, newValue) =>
                setNewSchedule({ ...newSchedule, instructor: newValue ? newValue.value : "" })
              }
              getOptionLabel={(option) => option.label || ""}
              renderInput={(params) => (
                <TextField {...params} label="Select Instructor" fullWidth />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveSchedule}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : selectedSchedule ? (
              "Update"
            ) : (
              "Add"
            )}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
}
