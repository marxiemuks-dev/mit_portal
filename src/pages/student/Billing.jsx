import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
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
  DialogActions,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddCardIcon from '@mui/icons-material/AddCard';
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
// Replace with your actual action import (if available)
import { getAllStudents } from "../../actions/student";
import { addBilling, getAllBilling, getBillingByStudentId, updateBilling } from "../../actions/billing";
import AddPaymentDialog from "../../components/AddPaymentDialog";

// Mock fallback students (used if fetch fails)
const MOCK_STUDENTS = [
  {
    id: 1,
    student_no: "2025-0001",
    lrn: "123456789012",
    last_name: "Santos",
    first_name: "Alice",
    middle_name: "Reyes",
    gender: "Female",
    year_level: "3rd Year",
    course: "BSN",
  },
  {
    id: 2,
    student_no: "2025-0002",
    lrn: "123456789013",
    last_name: "Rivera",
    first_name: "Mark",
    middle_name: "Dela",
    gender: "Male",
    year_level: "2nd Year",
    course: "BSIT",
  },
];
const semesters = ["1st Semester", "2nd Semester", "Summer"];
const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];
const scholarshipOptions = ['None', 'Academic Scholarship','Brother & Sister','HASSAN Scholarship','HALUN Scholarship','UNIFAST','TDP','AHME'];
export default function BillingPage() {
  const dispatch = useDispatch();
  const [filterStudentNo, setFilterStudentNo] = useState("");
  const [filterSemester, setFilterSemester] = useState("1st Semester");
  const [filterSchoolYear, setFilterSchoolYear] = useState("2024-2025");
  // billing records state
  const [billingRecords, setBillingRecords] = useState([
    // example starting records (optional)
    {
      id: 1,
      studentId: 1,
      student_no: "2025-0001",
      fullName: "Santos, Alice Reyes",
      course: "BSN",
      yearLevel: "3rd Year",
      semester: "1st Semester",
      schoolYear: "2024-2025",
      totalMisc: 1200,
      prevBalance: 500,
      subsidized: 200,
      fullPayment: 4500,
      breakdown: {
        registration: 200,
        library: 100,
        laboratory: 300,
        other: 600,
      },
    },
  ]);
  // students (fetched or mock)
  const [students, setStudents] = useState([]);
  const [studentsLoading, setStudentsLoading] = useState(false);
  // dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [openAddPayment, setOpenAddPayment] = useState(false);
  const [addPaymentData, setAddPaymentData] = useState(null);
  // form data for dialog
  const initialForm = {
    student: null, // student object
    semester: semesters[0],
    schoolYear: schoolYears[0],
    scholarshipStatus: scholarshipOptions[0],
    totalUnit: "",
    tuitionFee: "",
    totalMisc: 9500,
    totalMiscOtherFee: "",
    prevBalance: "",
    subsidized: "",
    fullPayment: "",
    totalBill: ""
  };
  const [formData, setFormData] = useState(initialForm);
  const [editFormData, setEditFormData] = useState(initialForm);
  // delete confirmation
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null });
  // snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  // fetch students from backend (if action exists)
  useEffect(() => {
    let mounted = true;
    const fetchStudents = async () => {
      setStudentsLoading(true);
      try {
        if (typeof dispatch === "function" && getAllStudents) {
          // try using action
          const res = await dispatch(getAllStudents());
          if (res && res.status === true && Array.isArray(res.data)) {
            if (!mounted) return;
            setStudents(
              res.data.map((s) => ({
                ...s,
              }))
            );
            setStudentsLoading(false);
            return;
          }
        }
        // fallback to mock if fetch fails or action isn't available
        setStudents(MOCK_STUDENTS);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        setStudents(MOCK_STUDENTS);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchStudents();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  useEffect(() => {
    const fetchBilling = async () => {
      try {

        const storedUser = localStorage.getItem("mitportal_user");
        const parsedUser = JSON.parse(storedUser);
        setCurrentStudent(parsedUser)

        const result = await dispatch(getAllBilling());
        if (result.status === true) {
          const formattedBillingData = result.data.map((item) => ({
            billing_id: item.billing_id,
            student_id: item.student_id,
            studentID: item.studentID,
            totalMisc: item.total_misc ?? 0,
            totalMiscOtherFee: item.total_misc_other_fee ?? 0,
            prevBalance: item.previouse_balance ?? 0,
            subsidized: item.subsidized_by_school ?? 0,
            totalBill: item.total_bill ?? 0,
            fullPayment: item.full_payment ?? 0,
            totalPayment: item.total_payment ?? 0,
            current_bill: item.current_bill ?? 0,
            totalUnit: item.total_unit ?? 0,
            tuitionFee: item.tuition_fee ?? 0,
            scholarshipStatus: item.scholarship_status || "None",
            created_at: item.created_at,
            semester: item.semester || "N/A",
            schoolYear: item.school_year || "N/A",

            // 🧩 Student Information
            course:
              item.course ||
              item.students?.course ||
              item.studentEnrollment?.current_course ||
              "N/A",
            yearLevel:
              item.year_level ||
              item.studentEnrollment?.current_year_level ||
              "N/A",
            student_no:
              item.student_no ||
              item.students?.student_no ||
              item.studentEnrollment?.students?.student_no ||
              "N/A",
            student_uuid:
              item.students?.id ||
              item.studentEnrollment?.students?.id ||
              null,
            fullName:
              item.students
                ? `${item.students.first_name} ${item.students.middle_name || ""} ${item.students.last_name}`.trim()
                : item.studentEnrollment?.students
                ? `${item.studentEnrollment.students.first_name} ${item.studentEnrollment.students.middle_name || ""} ${item.studentEnrollment.students.last_name}`.trim()
                : "N/A",

            // 🧾 Payments and Nested Data
            students: item.students || item.studentEnrollment?.students || {},
            payments: item.payments || item.payment || [],
          }));

          // 🧠 Sort alphabetically by last name, then by first name
          const sortedBillingData = formattedBillingData.sort((a, b) => {
            const lastA = a.students?.last_name?.toLowerCase() || "";
            const lastB = b.students?.last_name?.toLowerCase() || "";
            const firstA = a.students?.first_name?.toLowerCase() || "";
            const firstB = b.students?.first_name?.toLowerCase() || "";

            // Sort by last name first, then by first name if last names are equal
            if (lastA === lastB) return firstA.localeCompare(firstB);
            return lastA.localeCompare(lastB);
          });

          console.log(parsedUser)
          console.log(sortedBillingData)
          setBillingRecords(sortedBillingData);
        } else {
          console.log(result);
        }
      } catch (err) {
        console.error("Failed to fetch billing:", err);
        setStudents(MOCK_STUDENTS);
      } finally {
        setStudentsLoading(false);
      }
    };

    fetchBilling();
  }, [dispatch, openAddPayment]);

  const [currentStudent, setCurrentStudent] = useState(null);
  const filteredBilling = billingRecords.filter((billing) => {
    const studentNo = billing.student_no ? billing.student_no.toLowerCase() : "";
    const semester = billing.semester ? billing.semester.toLowerCase() : "";
    const schoolYear = billing.schoolYear ? billing.schoolYear.toLowerCase() : "";
    return (
      (filterStudentNo === "" ||
        studentNo.includes(filterStudentNo.toLowerCase())) &&
      (filterSemester === "" ||
        semester === filterSemester.toLowerCase()) &&
      (filterSchoolYear === "" ||
        schoolYear === filterSchoolYear.toLowerCase()) &&
        currentStudent?.userStudentID.includes(billing?.studentID)
    );
  });

  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Billing & Payments
      </Typography>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Billing Records</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Semester"
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              size="small"
              select
              SelectProps={{ native: true }}
            >
              <option value="">All</option>
                          {semesters.map((sem) => (
                            <option key={sem} value={sem}>
                              {sem}
                            </option>
                          ))}
            </TextField>
            <TextField
              label="School Year"
              value={filterSchoolYear}
              onChange={(e) => setFilterSchoolYear(e.target.value)}
              size="small"
              select
              SelectProps={{ native: true }}
            >
              <option value="">All</option>

                          {schoolYears.map((sy) => (
                            <option key={sy} value={sy}>
                              {sy}
                            </option>
                          ))}
            </TextField>
          </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Student No.</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>School Year</TableCell>
                  <TableCell align="right">Total Misc</TableCell>
                  <TableCell align="right">Subsidized</TableCell>
                  <TableCell align="right">Full Payment</TableCell>
                  <TableCell align="right">Current Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredBilling.map((r, idx) => (
                  <TableRow key={idx} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{r.student_no}</TableCell>
                    <TableCell>{r.fullName}</TableCell>
                    <TableCell>{r.semester}</TableCell>
                    <TableCell>{r.schoolYear}</TableCell>
                    <TableCell align="right">₱ {Number(r.totalMisc).toLocaleString()}</TableCell>
                    <TableCell align="right">₱ {Number(r.subsidized).toLocaleString()}</TableCell>
                    <TableCell align="right">₱ {Number(r.fullPayment).toLocaleString()}</TableCell>
                    <TableCell align="right">₱ {Number(r.current_bill).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                {billingRecords.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 4 }}>
                      No billing records
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
