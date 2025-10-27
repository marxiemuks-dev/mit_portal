import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  CircularProgress,
  Alert,
  Divider,
  Autocomplete,
  TextField,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import { useDispatch } from "react-redux";
import { getAllStudents } from "../../actions/student";
import { getGradeForEverySchedule } from "../../actions/grade";
import jsPDF from "jspdf";
import "jspdf-autotable";

const GradeEvaluation = () => {
  const dispatch = useDispatch();

  const [studentList, setStudentList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Compute Final Grade
  const computeFinalGrade = (subject) => {
    const { premid, midterm, prefinal, finalterm } = subject;
    const grades = [premid, midterm, prefinal, finalterm].filter(
      (g) => g !== null && g !== undefined && g !== 0
    );
    if (grades.length === 0) return null;
    const avg = grades.reduce((a, b) => a + b, 0) / grades.length;
    return avg.toFixed(2);
  };

  // ✅ Get Remarks (your logic)
  const getRemarks = (subject) => {
    const { premid, midterm, prefinal, finalterm } = subject;

    // Check for incomplete or zero grades
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

    const avg = parseFloat(computeFinalGrade(subject));

    if (avg >= 1.0 && avg <= 1.25) return "Excellent";
    if (avg > 1.26 && avg <= 1.99) return "Very Good";
    if (avg > 2.0 && avg <= 2.49) return "Good";
    if (avg > 2.50 && avg <= 2.99) return "Satisfactory";
    if (avg === 3.0) return "Passing";
    if (avg >= 3.1 && avg <= 5.0) return "Failure";

    return "";
  };

// ✅ Fetch all students
const fetchStudents = async () => {
  try {
    // Get current logged-in user
    const storedUser = localStorage.getItem("mitportal_user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);

    // Fetch all students
    const result = await dispatch(getAllStudents());
    if (result.status === true) {
      // Format student list for Autocomplete
      const formatted = result.data.map((s) => ({
        id: s.id,
        label: `${s.student_no} | ${s.first_name} ${s.last_name} | ${s.course}`,
      }));
      setStudentList(formatted);

      // ✅ Automatically select the logged-in student
      const matchedStudent = formatted.find(
        (s) => s.id === parsedUser.userStudentID
      );

      if (matchedStudent) {
        setSelectedStudent(matchedStudent);
      }
    }
  } catch (err) {
    console.error("Error fetching students:", err);
  }
};

// ✅ Load students and auto-select logged-in student on mount
useEffect(() => {
  fetchStudents();
}, []);

// ✅ Fetch grade evaluation when student is selected
useEffect(() => {
  const fetchGrades = async () => {
    if (!selectedStudent) return;
    setLoading(true);
    setError("");
    setData(null);

    try {
      const result = await dispatch(getGradeForEverySchedule());
      if (result.status) {
        // ✅ Filter only the selected student
        const student = result.data.find(
          (s) => s.student_id === selectedStudent.id
        );

        if (!student) {
          setError("No grades found for this student");
          setData(null);
          return;
        }

        // ✅ Group student's subjects by school_year + semester
        const grouped = {};
        student.subjects.forEach((subject) => {
          const key = `${subject.school_year} - ${subject.semester}`;
          if (!grouped[key]) {
            grouped[key] = {
              school_year: subject.school_year,
              semester: subject.semester,
              subjects: [],
            };
          }

          // Compute average and remark
          const avg = computeFinalGrade(subject);
          const remark = getRemarks(subject);

          grouped[key].subjects.push({
            ...subject,
            average: avg,
            remark,
          });
        });

        const formattedData = {
          student: {
            name: student.student_name,
            student_no: student.student_no,
            course: student.course,
            year_level: student.year_level,
            email: student.email || "N/A",
          },
          evaluation: Object.values(grouped),
        };

        setData(formattedData);
      } else {
        setError(result.message || "Failed to fetch grades");
      }
    } catch (err) {
      console.error("❌ Server error while fetching grade evaluation", err);
      setError("Server error while fetching grade evaluation");
    } finally {
      setLoading(false);
    }
  };

  fetchGrades();
}, [selectedStudent]);


  // ✅ Generate PDF (also includes Average + Remark)
  const handlePrintPDF = () => {
    if (!data) return;

    const doc = new jsPDF();
    const margin = 14;
    let y = 20;

    doc.setFontSize(16);
    doc.text("Student Grade Evaluation", 105, y, { align: "center" });
    y += 10;

    doc.setFontSize(12);
    doc.text(`Name: ${data.student.name}`, margin, y);
    y += 6;
    doc.text(`Student No: ${data.student.student_no}`, margin, y);
    y += 6;
    doc.text(`Course: ${data.student.course}`, margin, y);
    y += 6;
    doc.text(`Year Level: ${data.student.year_level}`, margin, y);
    y += 6;
    doc.text(`Email: ${data.student.email}`, margin, y);
    y += 10;

    data.evaluation.forEach((term, idx) => {
      if (idx > 0) y += 10;
      doc.setFontSize(13);
      doc.text(`${term.school_year} - ${term.semester}`, margin, y);
      y += 5;

      const tableData = term.subjects.map((s) => [
        s.subject_code,
        s.desc_title,
        s.units,
        s.premid ?? "-",
        s.midterm ?? "-",
        s.prefinal ?? "-",
        s.finalterm ?? "-",
        s.average ?? "-",
        s.remark ?? "-",
      ]);

      doc.autoTable({
        startY: y,
        head: [
          [
            "Subject Code",
            "Description",
            "Units",
            "Pre-mid",
            "Midterm",
            "Pre-final",
            "Final",
            "Average",
            "Remark",
          ],
        ],
        body: tableData,
        theme: "striped",
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { left: margin, right: margin },
      });

      y = doc.lastAutoTable.finalY + 10;
      const totalUnits = term.subjects.reduce(
        (sum, s) => sum + parseFloat(s.units || 0),
        0
      );
      doc.setFontSize(11);
      doc.text(`Total Units: ${totalUnits}`, margin, y);
      y += 5;
    });

    doc.setFontSize(10);
    doc.text("Generated by Grade Evaluation System", 105, 285, { align: "center" });
    doc.save(`${data.student.student_no}_Grade_Evaluation.pdf`);
  };

  return (
    <Box sx={{ p: 4, maxWidth: "1000px", mx: "auto" }}>
      <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
        Student Grade Evaluation
      </Typography>

      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="40vh">
          <CircularProgress />
        </Box>
      )}

      {error && !loading && (
        <Box p={3}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && data && (
        <>
          <Card sx={{ mb: 4, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight="bold">
                  Student Information
                </Typography>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<PictureAsPdfIcon />}
                  onClick={handlePrintPDF}
                >
                  Print PDF
                </Button>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography><strong>Name:</strong> {data.student.name}</Typography>
              <Typography><strong>Student No:</strong> {data.student.student_no}</Typography>
              <Typography><strong>Course:</strong> {data.student.course}</Typography>
              <Typography><strong>Email:</strong> {data.student.email}</Typography>
            </CardContent>
          </Card>

          {data.evaluation.map((term, index) => {
            const totalUnits = term.subjects.reduce(
              (sum, subj) => sum + parseFloat(subj.units || 0),
              0
            );

            return (
              <Accordion key={index} sx={{ mb: 2, borderRadius: 2, boxShadow: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">
                    {term.school_year} - {term.semester}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Subject Code</strong></TableCell>
                        <TableCell><strong>Description</strong></TableCell>
                        <TableCell align="center"><strong>Units</strong></TableCell>
                        <TableCell align="center"><strong>Pre-mid</strong></TableCell>
                        <TableCell align="center"><strong>Midterm</strong></TableCell>
                        <TableCell align="center"><strong>Pre-final</strong></TableCell>
                        <TableCell align="center"><strong>Final</strong></TableCell>
                        <TableCell align="center"><strong>Average</strong></TableCell>
                        <TableCell align="center"><strong>Remark</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {term.subjects.map((subject, i) => (
                        <TableRow key={i}>
                          <TableCell>{subject.subject_code}</TableCell>
                          <TableCell>{subject.desc_title}</TableCell>
                          <TableCell align="center">{subject.units}</TableCell>
                          <TableCell align="center">{subject.premid ?? "-"}</TableCell>
                          <TableCell align="center">{subject.midterm ?? "-"}</TableCell>
                          <TableCell align="center">{subject.prefinal ?? "-"}</TableCell>
                          <TableCell align="center">{subject.finalterm ?? "-"}</TableCell>
                          <TableCell align="center">{subject.average ?? "-"}</TableCell>
                          <TableCell
                            align="center"
                            sx={{
                              color:
                                subject.remark === "Failure"
                                  ? "red"
                                  : subject.remark === "Incomplete"
                                  ? "orange"
                                  : "green",
                              fontWeight: "bold",
                            }}
                          >
                            {subject.remark}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow sx={{ backgroundColor: "#f9f9f9" }}>
                        <TableCell colSpan={2} align="right">
                          <strong>Total Units:</strong>
                        </TableCell>
                        <TableCell align="center">
                          <strong>{totalUnits}</strong>
                        </TableCell>
                        <TableCell colSpan={6}></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </>
      )}
    </Box>
  );
};

export default GradeEvaluation;
