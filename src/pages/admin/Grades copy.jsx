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

export default function Grades() {
  const semesters = ["1st Semester", "2nd Semester", "Summer"];
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
    return ((student.premid + student.midterm + student.prefinal + student.finalterm) / 4).toFixed(2);
  };
  const handlePrint = () => {
  if (!selectedSubject || enrolledStudent.length === 0) {
    alert("⚠️ No data to print. Make sure a subject is selected and there are students.");
    return;
  }

  const doc = new jsPDF('p', 'pt', 'a4'); // Portrait, points, A4 size
  const title = `${selectedSubject.descriptiveTitle} (${selectedSubject.subjectCode})`;
  const teacher = `Teacher: ${selectedSubject.instructor}`;
  const semester = `Semester: ${selectedSubject.semester}`;
  const schoolYear = `School Year: ${selectedSubject.schoolYear}`;

  doc.setFontSize(16);
  doc.text(title, 40, 40);
  doc.setFontSize(12);
  doc.text(teacher, 40, 60);
  doc.text(semester, 40, 80);
  doc.text(schoolYear, 40, 100);

  // Prepare table data
  const tableColumn = ["#", "Student No", "Student Name", "Pre-Mid", "Midterm", "Pre-Final", "Final-Term", "Average"];
  const tableRows = [];

  enrolledStudent.forEach((student, index) => {
    const studentData = [
      index + 1,
      student.student_no,
      student.student_name,
      student.premid,
      student.midterm,
      student.prefinal,
      student.finalterm,
      computeFinalGrade(student),
    ];
    tableRows.push(studentData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 120,
    theme: 'grid',
    headStyles: { fillColor: [245, 245, 245], textColor: [0, 0, 0] },
    styles: { fontSize: 10, cellPadding: 4 },
  });

  doc.save(`${selectedSubject.subjectCode}_Grades.pdf`);
};


  useEffect(() => {
    // Filter schedules whenever semester, school year, or schedules list changes
    const filtered = schedules.filter(
      (s) => s.semester === filterSemester && s.schoolYear === filterSchoolYear
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
      const refresh = await dispatch(getStudentGradesBySchedule(selectedSubject.id));
      console.log(result.data)
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
          console.log(result)
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
      try {
        const result = await dispatch(getAllSchedule());

        if (!result || result.status === false) {
          console.error("Failed to fetch schedules:", result?.message || "Unknown error");
          return;
        }

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
      } catch (error) {
        console.error("Error fetching schedule:", error);
      }
    };

    fetchSchedule();
  }, [loading, dispatch]);


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
                    <TableCell>Pre-Mid</TableCell>
                    <TableCell>Midterm</TableCell>
                    <TableCell>Pre-Final</TableCell>
                    <TableCell>Final-Term</TableCell>
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
                      label="Pre-Mid"
                      type="number"
                      fullWidth
                      value={selectedGrade.premid || ""}
                      onChange={(e) =>
                        setSelectedGrade({ ...selectedGrade, premid: e.target.value })
                      }
                    />
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
