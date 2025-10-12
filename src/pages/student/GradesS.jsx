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
import { addStudentGrades, getStudentGradesBySchedule, getStudentGradesByStudentId, updateStudentGrade } from "../../actions/grade";
import { getEnrollmentsBySemesterAndYear } from "../../actions/enrollment";
import { useNavigate } from "react-router-dom";

export default function Grades() {
  const semesters = ["1st Semester", "2nd Semester"];
  const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];
  const [filterSemester, setFilterSemester] = useState(semesters[0]);
  const [filterSchoolYear, setFilterSchoolYear] = useState(schoolYears[0]);
  const dispatch = useDispatch();
  const handleGradeChange = (studentId, field, value) => {
    
  };

  const computeFinalGrade = (student) => {
    return ((student.premid + student.midterm + student.prefinal + student.finalterm) / 4).toFixed(2);
  };

const handlePrint = () => {
  if (!studentGrades || studentGrades.length === 0) {
    alert("⚠️ No data to print. Make sure the table is rendered.");
    return;
  }

  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title and header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Grade Report", pageWidth / 2, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Semester: ${filterSemester}`, 20, 30);
  doc.text(`School Year: ${filterSchoolYear}`, 20, 37);

  if (currentStudent) {
    doc.text(`Student Name: ${currentStudent.fullName || currentStudent.name || "N/A"}`, 20, 44);
    doc.text(`Student No: ${currentStudent.userStudentID || "N/A"}`, 20, 51);
  }

  // Prepare table data
  const tableColumn = [
    "No.",
    "Subject Code",
    "Subject Title",
    "Pre-Mid",
    "Midterm",
    "Pre-Final",
    "Final-Term",
    "Average",
  ];

  const tableRows = studentGrades.map((student, index) => [
    index + 1,
    student.schedule.subject_code,
    student.schedule.desc_title,
    student.premid || 0,
    student.midterm || 0,
    student.prefinal || 0,
    student.finalterm || 0,
    computeFinalGrade(student),
  ]);

  // Generate table
  doc.autoTable({
    startY: 60,
    head: [tableColumn],
    body: tableRows,
    styles: { halign: "center" },
    headStyles: { fillColor: [240, 240, 240] },
    theme: "grid",
  });

  // Total subjects summary
  const finalY = doc.lastAutoTable.finalY + 10;
  doc.text(
    `Total Subjects: ${studentGrades.length}`,
    20,
    finalY
  );

  // Save the file
  doc.save(`Grade_Report_${filterSchoolYear.replace("/", "-")}.pdf`);
};


 
  const [currentStudent, setCurrentStudent] = useState(null);
  const [studentGrades, setStudentGrades] = useState([])
  const [filteredGrades, setFilteredGrades] = useState([])
  const [allGrades, setAllGrades] = useState(filteredGrades[0]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrollment = async () => {
      const storedUser = localStorage.getItem("mitportal_user");
      if (!storedUser) {
        navigate("/signin");
        return;
      }
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentStudent(parsedUser)
        const result = await dispatch(getStudentGradesByStudentId(parsedUser.userStudentID));
        console.log(result)
        if (result.status === "success" && result.data) {
        const filtered = result.data.filter(
          (s) => s.schedule.semester === filterSemester && s.schedule.school_year === filterSchoolYear && s.studentEnrollment.student_id === parsedUser.userStudentID
        );
          setStudentGrades(filtered);
        } else {
          setStudentGrades(null);
        }
      } catch (err) {
        console.error(err);
        navigate("/signin");
      }
    };
    fetchEnrollment();
  }, [filterSemester, filterSchoolYear]);

  useEffect(() => {
    console.log(studentGrades)
    const filtered = studentGrades.filter(
      (s) => s.schedule.semester === filterSemester && s.schedule.school_year === filterSchoolYear
    );

    setFilteredGrades(filtered);

    // Reset selected subject if it's not in the new filtered list
    if (filtered.length > 0) {
      setAllGrades(filtered[0]);
    } else {
      setAllGrades(null);
    }
  }, [filterSemester, filterSchoolYear]);

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Grade
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
      </Grid>

      {studentGrades && (
        <Card id="print-area">
          <CardContent>
            <Typography variant="body2" color="text.secondary" gutterBottom>
  
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {studentGrades.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{student.schedule.subject_code}</TableCell>
                      <TableCell>{student.schedule.desc_title}</TableCell>
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
                    </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body1">
                Total Subjects:
                <strong>{studentGrades.length}</strong>
              </Typography>
              <Button variant="contained" color="primary" onClick={handlePrint}>
                Print Grades
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
