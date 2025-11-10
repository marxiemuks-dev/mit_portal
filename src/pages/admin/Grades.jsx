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
  Autocomplete,
} from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import AddStudentToSubjectDialog from "../../components/AddStudentToSubject";
import { useDispatch } from "react-redux";
import { getAllSchedule } from "../../actions/schedule";
import { addStudentGrades, getStudentGradesBySchedule, updateStudentGrade } from "../../actions/grade";
import { getEnrollmentsBySemesterAndYear } from "../../actions/enrollment";

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import GradeEvaluation from "../../components/GradeEvaluation ";
import axiosInstance from "../../API/AXIOS_INSTANCE";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

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
  const [facultyList, setFacultyList] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

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
            setSelectedFaculty(formatted[0].label)
          }
        } catch (error) {
          console.error("Error fetching faculty:", error);
        }
      };
      fetchFaculty();
    }, []);

  const handleGradeChange = (studentId, field, value) => {

  };

  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState(null);

  const computeFinalGrade = (student, subject) => {
  const { premid, midterm, prefinal, finalterm } = student;

  // Handle Summer subjects (only Midterm + Finalterm)
  if (student?.schedule.semester === "Summer") {
    if (
      midterm === null ||
      finalterm === null ||
      midterm === 0 ||
      finalterm === 0
    ) {
      return " ";
    } else {
      return ((Number(midterm) + Number(finalterm)) / 2).toFixed(2);
    }
  }

  // Handle Regular Semesters
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
    return " ";
  } else {
    return (
      (Number(premid) + Number(midterm) + Number(prefinal) + Number(finalterm)) /
      4
    ).toFixed(2);
  }
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
      (s) => s.semester === filterSemester && s.schoolYear === filterSchoolYear && s.instructor === selectedFaculty?.label
    );

    setFilteredSubject(filtered);

    // Reset selected subject if it's not in the new filtered list
    if (filtered.length > 0) {
      setSelectedSubject(filtered[0]);
    } else {
      setSelectedSubject(null);
    }
  }, [filterSemester, filterSchoolYear, schedules, selectedFaculty]);

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

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Submitted Grade" {...a11yProps(0)} />
          <Tab label="Manage Grade Evaluation" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "80vh" }}>
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
            Submitted Grade
          </Typography>

          {/* Filters */}
          <Grid container spacing={2} mb={3}>
            <Box minWidth={'300px'}>
              <Autocomplete
                options={facultyList}
                value={facultyList.find((f) => f.label === selectedFaculty?.label) || null}
                onChange={(e, newValue) => setSelectedFaculty(newValue)}
                getOptionLabel={(option) => option.label || ""}
                renderInput={(params) => (
                  <TextField {...params} label="Select Instructor" fullWidth />
                )}
              />
            </Box>
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
                  {/* <Button
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
                  </Button> */}
                </Box>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Submitted By: {selectedSubject.instructor}
                </Typography>
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
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer> */}
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

          <TableCell>{computeFinalGrade(student)}</TableCell>
          <TableCell>{getRemarks(student)}</TableCell>
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
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <GradeEvaluation/>
      </CustomTabPanel>
    </Box>
  )
}
