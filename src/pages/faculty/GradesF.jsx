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
  const semesters = ["1st Semester", "2nd Semester","Summer"];
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
    
  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);
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
              setCurrentStudent(parsedUser)
            } catch (err) {
              console.error(err);
              navigate("/signin");
            }
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
      const result = await dispatch(addStudentGrades(0,0,0,0,studentSubjectData.studentId,studentSubjectData.subjectId))
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
          setEnrolledStudent(result.data)
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
  
  const computeFinalGrade = (student) => {
    const { premid, midterm, prefinal, finalterm } = student;
    // Helper: round to nearest grade
    const roundToGrade = (value) => {
      const gradeScale = [1.0, 1.25, 1.5, 1.75, 2.0, 2.25, 2.5, 2.75, 3.0];

      // If between 3.0 and 4.0 → round to 5
      if (value > 3.0 && value <= 4.0) return "5";

      // If above 4.0 → failing grade
      if (value > 4.0) return "5";

      // Find closest grade from the scale
      let closest = gradeScale.reduce((prev, curr) =>
        Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
      );

      return closest.toFixed(2);
    };

    // SUMMER: only Midterm + Finalterm
    if (student?.schedule.semester === "Summer") {
      if (!midterm || !finalterm) {
        return " ";
      }

      const average = (Number(midterm) + Number(finalterm)) / 2;
      return roundToGrade(average);
    }

    // REGULAR SEMESTER: Premid + Midterm + Prefinal + Final
    if (!premid || !midterm || !prefinal || !finalterm) {
      return " ";
    }

    const average =
      (Number(premid) +
        Number(midterm) +
        Number(prefinal) +
        Number(finalterm)) /
      4;

    return roundToGrade(average);
  };

  const [isIncomplete, seIsIncomplete] = useState(false)
  const getRemarks = (student, subject) => {
  const { premid, midterm, prefinal, finalterm } = student;

  console.log(student.schedule)
  // Summer subjects (only Midterm + Finalterm)
  if (student?.schedule.semester === "Summer") {
    if (
      midterm === null ||
      finalterm === null ||
      midterm === 0 ||
      finalterm === 0
    ) {
      return "Incomplete";
    }

    const avg = parseFloat(computeFinalGrade(student, subject));
    if (avg >= 1.0 && avg <= 1.25) return "Excellent";
    if (avg >= 1.26 && avg <= 1.99) return "Very Good";
    if (avg >= 2.0 && avg <= 2.49) return "Good";
    if (avg >= 2.5 && avg <= 2.99) return "Satisfactory";
    if (avg === 3.0) return "Passing";
    if (avg >= 3.1 && avg <= 5.0) return "Failure";
    return "";
  }

  // Regular Semesters
  if (
    premid === null ||
    midterm === null ||
    prefinal === null ||
    finalterm === null ||
    premid === 0 ||
    midterm === 0 ||
    prefinal === 0 ||
    finalterm === 0
  ) {
    return "Incomplete";
  }

  const avg = parseFloat(computeFinalGrade(student, subject));
  if (avg >= 1.0 && avg <= 1.25) return "Excellent";
  if (avg >= 1.26 && avg <= 1.99) return "Very Good";
  if (avg >= 2.0 && avg <= 2.49) return "Good";
  if (avg >= 2.5 && avg <= 2.99) return "Satisfactory";
  if (avg === 3.0) return "Passing";
  if (avg >= 3.1 && avg <= 5.0) return "Failure";
  return "";
};


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

        {/* ✅ Conditional columns */}
        {filterSemester !== "Summer" && <TableCell>Pre-Mid</TableCell>}
        <TableCell>Midterm</TableCell>
        {filterSemester !== "Summer" && <TableCell>Pre-Final</TableCell>}
        <TableCell>Final-Term</TableCell>

        <TableCell>Final Grade</TableCell>
        <TableCell>Remarks</TableCell>
        <TableCell>Action</TableCell>
      </TableRow>
    </TableHead>

    <TableBody>
      {enrolledStudent.map((student, index) => (
        <TableRow key={student.id}>
          <TableCell>{index + 1}</TableCell>
          <TableCell>{student.student_no}</TableCell>
          <TableCell>{student.student_name}</TableCell>

          {/* ✅ Show Pre-Mid only if not Summer */}
          {filterSemester !== "Summer" && (
            <TableCell>
              <TextField
                disabled
                type="number"
                size="small"
                value={student.premid}
                onChange={(e) =>
                  handleGradeChange(student.id, "premid", e.target.value)
                }
                sx={{ width: 80 }}
              />
            </TableCell>
          )}

          {/* ✅ Always show Midterm */}
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

          {/* ✅ Show Pre-Final only if not Summer */}
          {filterSemester !== "Summer" && (
            <TableCell>
              <TextField
                disabled
                type="number"
                size="small"
                value={student.prefinal}
                onChange={(e) =>
                  handleGradeChange(student.id, "prefinal", e.target.value)
                }
                sx={{ width: 80 }}
              />
            </TableCell>
          )}

          {/* ✅ Always show Final-Term */}
          <TableCell>
            <TextField
              disabled
              type="number"
              size="small"
              value={student.finalterm}
              onChange={(e) =>
                handleGradeChange(student.id, "finalterm", e.target.value)
              }
              sx={{ width: 80 }}
            />
          </TableCell>
          {/* <TableCell>{computeFinalGrade(student)}</TableCell> */}
          {!isIncomplete && (
            <TableCell>{computeFinalGrade(student)}</TableCell>
          )}
          <TableCell>{getRemarks(student)}</TableCell>
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

            {/* <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2 }}>
              <Table>
                <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                  <TableRow>
                    <TableCell>#</TableCell>
                    <TableCell>Student No</TableCell>
                    <TableCell>Student Name</TableCell>
                    <TableCell>Pre-Mid</TableCell>
                    <TableCell>Midterm</TableCell>
                    <TableCell>Pre-Final</TableCell>
                    <TableCell>Final-Term</TableCell>
                    <TableCell>Average</TableCell>
                    <TableCell>Remarks</TableCell>
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
                            value={student.premid}
                            onChange={(e) =>
                              handleGradeChange(student.id, "premid", e.target.value)
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
                            value={student.prefinal}
                            onChange={(e) =>
                              handleGradeChange(student.id, "prefinal", e.target.value)
                            }
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            disabled
                            type="number"
                            size="small"
                            value={student.finalterm}
                            onChange={(e) =>
                              handleGradeChange(student.id, "finalterm", e.target.value)
                            }
                            sx={{ width: 80 }}
                          />
                        </TableCell>
                        <TableCell>{computeFinalGrade(student)}</TableCell>
                        <TableCell>{getRemarks(student)}</TableCell>
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
                    {
                      console.log(selectedSubject.semester)
                    }
                    {
                      selectedSubject?.semester !== "Summer" && (
                                            <TextField
                      margin="normal"
                      label="Pre-Mid"
                      type="number"
                      fullWidth
                      value={selectedGrade.premid || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, premid: e.target.value })
                      }
                    />
                      )
                    }
                    <TextField
                      margin="normal"
                      label="Mid-Term"
                      type="number"
                      fullWidth
                      value={selectedGrade.midterm || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, midterm: e.target.value })
                      }
                    />
                    {
                      selectedSubject?.semester !== "Summer" && (
                                            <TextField
                      margin="normal"
                      label="Pre-Final"
                      type="number"
                      fullWidth
                      value={selectedGrade.prefinal || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, prefinal: e.target.value })
                      }
                    />
                      )
                    }
                    <TextField
                      margin="normal"
                      label="Final-Term"
                      type="number"
                      fullWidth
                      value={selectedGrade.finalterm || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, finalterm: e.target.value })
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
                          selectedGrade.premid,
                          selectedGrade.midterm,
                          selectedGrade.prefinal,
                          selectedGrade.finalterm
                        )
                      );
                      console.log(result)
                      if(result.status==="success"){
                        setSnackbar({
                          open: true,
                          message: "✅ Grade updated successfully!",
                          severity: "success",
                        });
                      }else{
                        setSnackbar({
                          open: true,
                          message: result.message,
                          severity: "error",
                        });
                      }
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
              {/* <Button variant="contained" color="primary" onClick={handlePrint}>
                Print Grades
              </Button> */}
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
