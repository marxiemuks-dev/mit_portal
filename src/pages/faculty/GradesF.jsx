import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddStudentToSubjectDialog from "../../components/AddStudentToSubject";
import { useDispatch } from "react-redux";
import { getAllSchedule } from "../../actions/schedule";
import { addStudentGrades, getStudentGradesBySchedule, updateStudentGrade } from "../../actions/grade";
import { getEnrollmentsBySemesterAndYear } from "../../actions/enrollment";
import { useNavigate } from "react-router-dom";

export default function Grades() {
  const semesters = ["1st Semester", "2nd Semester"];
  const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];
  const [filteredSubjects, setFilteredSubject] = useState([])
  const [selectedSubject, setSelectedSubject] = useState(filteredSubjects[0]); // ✅ fix: should be object or null
  const [filterSemester, setFilterSemester] = useState(semesters[0]);
  const [filterSchoolYear, setFilterSchoolYear] = useState(schoolYears[0]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [studentSubjectData, setStudentSubjectData] = useState({
    studentId: "",
    subjectId: "",
    semester: "",
    schoolYear: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [students, setStudents] = useState([])
  const [loadingAdd, setLoadingAdd] = useState(false);
  const dispatch = useDispatch();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [enrolledStudent, setEnrolledStudent] = useState([])

  const handleGradeChange = (studentId, field, value) => {
    
    // setSelectedSubject((prev) => ({
    //   ...prev,
    //   students: prev.students.map((student) =>
    //     student.id === studentId
    //       ? { ...student, [field]: Number(value) }
    //       : student
    //   ),
    // }));
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);


  const computeFinalGrade = (student) => {
    return ((student.prelim + student.midterm + student.final) / 3).toFixed(2);
  };

  const handlePrint = () => {
  const printContent = document.getElementById("print-area");

  if (!printContent) {
    alert("⚠️ No data to print. Make sure the table is rendered.");
    return;
  }

  const newWin = window.open("", "", "width=900,height=650");
  newWin.document.write(`
    <html>
      <head>
        <title>Grade Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h2, p {
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
            text-align: center;
          }
          th {
            background-color: #f5f5f5;
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
      </body>
    </html>
  `);
  newWin.document.close();
  newWin.focus();
  newWin.print();
  // newWin.close();
};

    const navigate = useNavigate();
    const [currentStudent, setCurrentStudent] = useState([]);
  useEffect(() => {
    // Filter schedules whenever semester, school year, or schedules list changes
          const storedUser = localStorage.getItem("mitportal_user");
          let parsedUser =[]
            if (!storedUser) {
              navigate("/signin");
              return;
            }
      
            try {
            parsedUser = JSON.parse(storedUser);
                          console.log(parsedUser)
              setCurrentStudent(parsedUser)
            } catch (err) {
              console.error(err);
              navigate("/signin");
            }
            console.log(schedules)
    const filtered = schedules.filter(
      (s) => s.semester === filterSemester && s.schoolYear === filterSchoolYear && s.instructor === parsedUser.instructor_name
    );

    setFilteredSubject(filtered);

    // Reset selected subject if it's not in the new filtered list
    if (filtered.length > 0) {
      setSelectedSubject(filtered[0]);
    } else {
      setSelectedSubject(null);
    }
  }, [filterSemester, filterSchoolYear, schedules]);

  const handleSaveStudentSubject = async () => {
    setLoadingAdd(true);
    try {
      console.log(studentSubjectData)
      const result = await dispatch(addStudentGrades(0,0,0,studentSubjectData.studentId,studentSubjectData.subjectId))
      console.log(result)
      if(result.status === "error"){

        setLoadingAdd(false)
            setSnackbar({
            open: true,
            message: result.message,
            severity: "error"
          });
      }
                            const refresh = await dispatch(
                        getStudentGradesBySchedule(selectedSubject.id)
                      );
                      setEnrolledStudent(refresh.data);
    } catch (error) {
      console.error("Failed to add student:", error);
    } finally {
      setLoadingAdd(false);
      setOpenAddDialog(false);
    }
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const result = await dispatch(getEnrollmentsBySemesterAndYear(filterSemester, filterSchoolYear));
        setStudents(result.data)
      } catch (err) {
        console.error(err);
      }
    };

    fetchEnrollments();
  }, [filterSemester, filterSchoolYear]);

  useEffect(() => {
    const fetchStudent = async () => {
      if (selectedSubject?.id) {
        try {
          const result = await dispatch(getStudentGradesBySchedule(selectedSubject.id));
          console.log("✅ Grades fetched:", result);
          setEnrolledStudent(result.data)
          // setSnackbar({
          //   open: true,
          //   message: result.response.data.message,
          //   severity: "success"
          // });
        } catch (error) {
          console.error("❌ Failed to fetch student grades:", error);
          setSnackbar({
            open: true,
            message: error,
            severity: "error"
          });
        }
      }
    };

    fetchStudent();
  }, [selectedSubject]);

  useEffect(() => {
      const fetchSchedule = async () => {
        const result = await dispatch(getAllSchedule())
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
  }, [loading]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
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
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Grade Management
      </Typography>

      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Semester"
            select
            fullWidth
            value={filterSemester}
            onChange={(e) => setFilterSemester(e.target.value)}
          >
            {semesters.map((sem) => (
              <MenuItem key={sem} value={sem}>
                {sem}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="School Year"
            select
            fullWidth
            value={filterSchoolYear}
            onChange={(e) => setFilterSchoolYear(e.target.value)}
          >
            {schoolYears.map((sy) => (
              <MenuItem key={sy} value={sy}>
                {sy}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Select Subject"
            select
            fullWidth
            value={selectedSubject ? selectedSubject.id : ""}
            onChange={(e) =>
              setSelectedSubject(
                filteredSubjects.find((subj) => subj.id === Number(e.target.value))
              )
            }
          >
            {filteredSubjects.length > 0 ? (
              filteredSubjects.map((subj) => (
                <MenuItem key={subj.id} value={subj.id}>
                  {subj.descriptiveTitle} ({subj.subjectCode})
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No schedules available</MenuItem>
            )}
          </TextField>
        </Grid>
      </Grid>

      {/* Show Table if Subject Selected */}
      {selectedSubject && (
        <Card id="print-area">
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h6">
                {selectedSubject.descriptiveTitle} ({selectedSubject.subjectCode})
              </Typography>
              <Button
                variant="contained"
                color="success"
                onClick={() => {
                  setStudentSubjectData({
                    studentId: "",
                    subjectId: selectedSubject.id,
                    semester: selectedSubject.semester,
                    schoolYear: selectedSubject.schoolYear,
                  });
                  setOpenAddDialog(true);
                }}
              >
                + Add Student
              </Button>
            </Box>

            <Typography variant="body2" color="text.secondary" gutterBottom>
              Teacher: {selectedSubject.instructor}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Student No</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Prelim</TableCell>
                    <TableCell>Midterm</TableCell>
                    <TableCell>Final</TableCell>
                    <TableCell>Average</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {enrolledStudent.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.student_no}</TableCell>
                      <TableCell>{student.student_name}</TableCell>
                      <TableCell>
                        <TextField
                          disabled
                          type="number"
                          size="small"
                          value={student.prelim}
                          onChange={(e) =>
                            handleGradeChange(student.id, "prelim", e.target.value)
                          }
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          disabled
                          type="number"
                          size="small"
                          value={student.midterm}
                          onChange={(e) =>
                            handleGradeChange(student.id, "midterm", e.target.value)
                          }
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          disabled
                          type="number"
                          size="small"
                          value={student.final}
                          onChange={(e) =>
                            handleGradeChange(student.id, "final", e.target.value)
                          }
                          sx={{ width: 80 }}
                        />
                      </TableCell>
                      <TableCell>{computeFinalGrade(student)}</TableCell>
                      <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => {
                          setSelectedGrade(student);
                          setOpenEditDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

{/* <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, boxShadow: 3 }}>
  <Table>
    <TableHead sx={{ bgcolor: "#1976d2" }}>
      <TableRow>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>#</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Student No</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Student Name</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Prelim</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Midterm</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Final</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Average</TableCell>
        <TableCell sx={{ color: "#fff", fontWeight: "bold" }}>Action</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {enrolledStudent.map((student, index) => (
        <TableRow key={student.id} hover>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{student.student_no}</TableCell>
          <TableCell>{student.student_name}</TableCell>
          <TableCell>{student.prelim}</TableCell>
          <TableCell>{student.midterm}</TableCell>
          <TableCell>{student.final}</TableCell>
          <TableCell>{computeFinalGrade(student)}</TableCell>
          <TableCell>
            <Button
              variant="contained"
              size="small"
              onClick={() => {
                setSelectedGrade(student);
                setOpenEditDialog(true);
              }}
            >
              Edit
            </Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</TableContainer> */}

            <Dialog
              open={openEditDialog}
              onClose={() => setOpenEditDialog(false)}
              fullWidth
              maxWidth="sm"
            >
              <DialogTitle>Edit Student Grade</DialogTitle>
              <DialogContent>
                {selectedGrade && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      {selectedGrade.student_name} ({selectedGrade.student_no})
                    </Typography>
                    <TextField
                      margin="normal"
                      label="Prelim"
                      type="number"
                      fullWidth
                      value={selectedGrade.prelim || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, prelim: e.target.value })
                      }
                    />
                    <TextField
                      margin="normal"
                      label="Midterm"
                      type="number"
                      fullWidth
                      value={selectedGrade.midterm || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, midterm: e.target.value })
                      }
                    />
                    <TextField
                      margin="normal"
                      label="Final"
                      type="number"
                      fullWidth
                      value={selectedGrade.final || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, final: e.target.value })
                      }
                    />
                  </Box>
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                <Button
                  variant="contained"
                  onClick={async () => {
                    try {
                      const result = await dispatch(
                        updateStudentGrade(
                          selectedGrade.id,
                          selectedGrade.prelim,
                          selectedGrade.midterm,
                          selectedGrade.final
                        )
                      );
                      console.log(result)
                      setSnackbar({
                        open: true,
                        message: "✅ Grade updated successfully!",
                        severity: "success",
                      });
                      setOpenEditDialog(false);

                      // Refresh table
                      const refresh = await dispatch(
                        getStudentGradesBySchedule(selectedSubject.id)
                      );
                      setEnrolledStudent(refresh.data);
                    } catch (error) {
                      console.error(error);
                      setSnackbar({
                        open: true,
                        message: "❌ Failed to update grade",
                        severity: "error",
                      });
                    }
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>


            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">
                Total Students:
                <strong>{enrolledStudent.length}</strong>
              </Typography>
              <Button variant="contained" color="primary" onClick={handlePrint}>
                Print Grades
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
      {/* Add Student Dialog */}
      <AddStudentToSubjectDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSave={handleSaveStudentSubject}
        loading={loadingAdd}
        students={students}
        subjects={selectedSubject}
        studentSubjectData={studentSubjectData}
        setStudentSubjectData={setStudentSubjectData}
      />
    </Box>
  );
}
