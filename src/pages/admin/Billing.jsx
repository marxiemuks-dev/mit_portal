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
import { addBilling, getAllBilling, updateBilling } from "../../actions/billing";
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
    totalMisc: "",
    prevBalance: "",
    subsidized: "",
    fullPayment: "",
    // optional detailed breakdown for "View Breakdown"
    breakdown: {
      registration: "",
      identification: "",
      library: "",
      dentalMedical: "",
      athletic: "",
      orgSSC: "",
      developmentalFee: "",
      immersion: "",
      affiliationFee: "",
      enhancementFee: "",
    },
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
        const result = await dispatch(getAllBilling());
        if (result.status === true) {
          const formattedBillingData = result.data.map((item) => ({
            billing_id: item.billing_id,
            student_id: item.student_id,
            studentID: item.studentID,
            totalMisc: item.total_misc,
            prevBalance: item.previouse_balance,
            subsidized: item.subsidized_by_school,
            total_bill: item.total_bill,
            fullPayment: item.full_payment,
            created_at: item.created_at,
            course: item.course || "N/A",
            yearLevel: item.year_level || "N/A",
            semester: item.semester,
            schoolYear: item.school_year,
            fullName: item.students
              ? `${item.students.first_name} ${item.students.middle_name || ""} ${item.students.last_name}`.trim()
              : "N/A",
            student_no: item.students?.student_no || "N/A",
            student_uuid: item.students?.id || null,
            students: item.students || {},
            payments: item.payments || [],
            current_bill: item.current_bill,
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
  // helpers
  const resetForm = () => {
    setFormData(initialForm);
    setEditingRecord(null);
  };

  const openEditDialog = (record) => {
    setEditFormData({
      student: record.students,
      semester: record.semester || semesters[0],
      schoolYear: record.schoolYear || schoolYears[0],
      totalMisc: record.totalMisc ?? "",
      prevBalance: record.prevBalance ?? "",
      subsidized: record.subsidized ?? "",
      fullPayment: record.fullPayment ?? "",
      breakdown: record.breakdown || initialForm.breakdown,
      billingID: record.billing_id,
      currentBill: record.current_bill
    });
    setEditingRecord(record);
    setOpenDialog(true);
  };
  const handleFormChange = (field, value) => {
    if(field === 'totalMisc'){
      setFormData((prev) => ({ ...prev, ['fullPayment']: calculateSubsidized(value).total.toFixed(2)}));
      setFormData((prev) => ({ ...prev, ['subsidized']: calculateSubsidized(value).discountAmount.toFixed(2)}));
    }
    if(field === 'subsidized'){
      setFormData((prev) => ({ ...prev, ['fullPayment']: calculateDiscount(formData.totalMisc, value).toFixed(2)}));
      setFormData((prev) => ({ ...prev, ['subsidized']:value}));
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFormChangeEdit = (field, value) => {
    if(field === 'totalMisc'){
      setEditFormData((prev) => ({ ...prev, ['fullPayment']: calculateSubsidized(value).total.toFixed(2)}));
      setEditFormData((prev) => ({ ...prev, ['subsidized']: calculateSubsidized(value).discountAmount.toFixed(2)}));
    }
    if(field === 'subsidized'){
      setEditFormData((prev) => ({ ...prev, ['fullPayment']: calculateDiscount(formData.totalMisc, value).toFixed(2)}));
      setEditFormData((prev) => ({ ...prev, ['subsidized']:value}));
    }
    setEditFormData((prev) => ({ ...prev, [field]: value }));
  };

  function calculateDiscount(bill, discountAmount) {
    const total = bill - discountAmount;
    return total;
  }
  function calculateSubsidized(totalMisc) {
    const discountPercent = 30;
    const discountAmount = (totalMisc * discountPercent) / 100;
    const total = totalMisc - discountAmount;
    return {total,discountAmount};
  }

  // Save (add or update)
  const handleSaveEdit = async () => {
    // basic validation
    if (!editFormData.student) {
      setSnackbar({ open: true, message: "Select a student", severity: "warning" });
      return;
    }
    if (!editFormData.totalMisc || !editFormData.subsidized || !editFormData.fullPayment) {
      setSnackbar({ open: true, message: "Fill all the billing information", severity: "warning" });
      return;
    }
    setFormLoading(true);
    try {
      const result = await dispatch(updateBilling(editFormData.billingID,editFormData.totalMisc,editFormData.prevBalance,editFormData.subsidized,editFormData.fullPayment,editFormData.semester,editFormData.schoolYear,editFormData.currentBill))
        if(result.status === true){
          setSnackbar({ open: true, message: "Billing added", severity: "success" });
          setOpenDialog(false);
          resetForm();
          const refresh = await dispatch(getAllBilling())
          const formattedBillingData = refresh.data.map((item) => ({
            billing_id: item.billing_id,
            student_id: item.student_id,
            studentID: item.studentID,
            totalMisc: item.total_misc,
            prevBalance: item.previouse_balance,
            subsidized: item.subsidized_by_school,
            total_bill: item.total_bill,
            fullPayment: item.full_payment,
            created_at: item.created_at,
            course: item.course || "N/A",
            yearLevel: item.year_level || "N/A",
            semester: item.semester,
            schoolYear: item.school_year,
            last_name: item.students.last_name,
            fullName: item.students
              ? `${item.students.first_name} ${item.students.middle_name || ""} ${item.students.last_name}`.trim()
              : "N/A",
            student_no: item.students?.student_no || "N/A",
            student_uuid: item.students?.id || null,
            students: item.students || {},
            payments: item.payments || [],
            current_bill: item.current_bill
          }));
          
          const sortedBillingData = formattedBillingData.sort((a, b) => {
            const lastA = a.students?.last_name?.toLowerCase() || "";
            const lastB = b.students?.last_name?.toLowerCase() || "";
            const firstA = a.students?.first_name?.toLowerCase() || "";
            const firstB = b.students?.first_name?.toLowerCase() || "";

              // Sort by last name first, then by first name if last names are equal
            if (lastA === lastB) return firstA.localeCompare(firstB);
            return lastA.localeCompare(lastB);
          });
        setBillingRecords(sortedBillingData);
        }else{
          setSnackbar({ open: true, message: result.message, severity: "error" });
        }
      setOpenDialog(false);
      resetForm();
    } catch (err) {
      console.error("Save billing error", err);
      setSnackbar({ open: true, message: "Failed to save billing", severity: "error" });
    } finally {
      setFormLoading(false);
    }
  };
  const confirmDeleteNow = () => {
    const { id } = confirmDelete;
    setBillingRecords((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete({ open: false, id: null });
    setSnackbar({ open: true, message: "Billing deleted", severity: "info" });
  };
  const handleAddPayment = (record) => {
    setAddPaymentData(record || null);
    setOpenAddPayment(true);
  };

  const handleAddBilling = async () => {
    // basic validation
    if (!formData.student?.id) {
      setSnackbar({ open: true, message: "Select a student", severity: "warning" });
      return;
    }
    if (!formData.totalMisc || !formData.subsidized || !formData.fullPayment) {
      setSnackbar({ open: true, message: "Fill all the billing information", severity: "warning" });
      return;
    }
    setFormLoading(true);
    try {
      const payload = {
        studentId: formData.student.id,
        student_no: formData.student.student_no,
        fullName: `${formData.student.last_name}, ${formData.student.first_name} ${formData.student.middle_name || ""}`.trim(),
        course: formData.student.course || "",
        yearLevel: formData.student.year_level || "",
        semester: formData.semester,
        schoolYear: formData.schoolYear,
        totalMisc: Number(formData.totalMisc || 0),
        prevBalance: Number(formData.prevBalance || 0),
        subsidized: Number(formData.subsidized || 0),
        fullPayment: Number(formData.fullPayment || 0),
        breakdown: formData.breakdown,
      };
      if (editingRecord) {
        // update existing
        setBillingRecords((prev) => prev.map((r) => (r.id === editingRecord.id ? { ...r, ...payload } : r)));
        setSnackbar({ open: true, message: "Billing updated", severity: "success" });
      } else {
        // add new
        const newRec = {
          id: billingRecords.length ? Math.max(...billingRecords.map((r) => r.id)) + 1 : 1,
          ...payload,
        };
        const result = await dispatch(addBilling(payload.studentId,payload.totalMisc,payload.prevBalance,payload.subsidized,payload.fullPayment,payload.semester,payload.schoolYear))
        console.log(result)
        if(result.status === true){
          setSnackbar({ open: true, message: "Billing added", severity: "success" });
          setOpenDialog(false);
          resetForm();
          const refresh = await dispatch(getAllBilling())
          const formattedBillingData = refresh.data.map((item) => ({
            billing_id: item.billing_id,
            student_id: item.student_id,
            studentID: item.studentID,
            totalMisc: item.total_misc,
            prevBalance: item.previouse_balance,
            subsidized: item.subsidized_by_school,
            total_bill: item.total_bill,
            fullPayment: item.full_payment,
            created_at: item.created_at,
            course: item.course || "N/A",
            yearLevel: item.year_level || "N/A",
            semester: item.semester,
            schoolYear: item.school_year,
            last_name: item.students.last_name,
            fullName: item.students
              ? `${item.students.first_name} ${item.students.middle_name || ""} ${item.students.last_name}`.trim()
              : "N/A",
            student_no: item.students?.student_no || "N/A",
            student_uuid: item.students?.id || null,
            students: item.students || {},
            payments: item.payments || [],
            current_bill: item.current_bill
          }));
          
          const sortedBillingData = formattedBillingData.sort((a, b) => {
            const lastA = a.students?.last_name?.toLowerCase() || "";
            const lastB = b.students?.last_name?.toLowerCase() || "";
            const firstA = a.students?.first_name?.toLowerCase() || "";
            const firstB = b.students?.first_name?.toLowerCase() || "";

              // Sort by last name first, then by first name if last names are equal
            if (lastA === lastB) return firstA.localeCompare(firstB);
            return lastA.localeCompare(lastB);
          });
        setBillingRecords(sortedBillingData);
        }else{
          setSnackbar({ open: true, message: result.message, severity: "error" });
        }
      }
    } catch (err) {
      console.error("Save billing error", err);
      setSnackbar({ open: true, message: "Failed to save billing", severity: "error" });
    } finally {
      setFormLoading(false);
    }
  };
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
      schoolYear === filterSchoolYear.toLowerCase())
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
      <Card sx={{ p: 4, mb:3, borderRadius: 3, boxShadow: 3 }}>
        {/* Student Information */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Student Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
          <Autocomplete
            sx={{ flex: 1, minWidth: 400 }}
            options={students}
            getOptionLabel={(option) =>
              option
                ? `${option.student_no} | ${option.last_name}, ${option.first_name} (${option.course})`
                : ""
            }
            value={formData.student}
            onChange={(e, newVal) => handleFormChange("student", newVal)}
            loading={studentsLoading}
            renderInput={(params) => (
              <TextField {...params} label="Select Student" size="small" fullWidth />
            )}
          />

          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Semester</InputLabel>
            <Select
              label="Semester"
              value={formData.semester}
              onChange={(e) => handleFormChange("semester", e.target.value)}
            >
              {semesters.map((s) => (
                <MenuItem key={s} value={s}>
                  {s}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>School Year</InputLabel>
            <Select
              label="School Year"
              value={formData.schoolYear}
              onChange={(e) => handleFormChange("schoolYear", e.target.value)}
            >
              {schoolYears.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        {formData.student && (
          <>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Student Details
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <TextField
                label="Student No."
                size="small"
                sx={{ flex: 1, minWidth: 220 }}
                value={formData.student.student_no}
                disabled
              />
              <TextField
                label="Full Name"
                size="small"
                sx={{ flex: 2, minWidth: 300 }}
                value={`${formData.student.last_name}, ${formData.student.first_name} ${
                  formData.student.middle_name || ""
                }`}
                disabled
              />
              <TextField
                label="Course"
                size="small"
                sx={{ flex: 1, minWidth: 200 }}
                value={formData.student.course}
                disabled
              />
            </Box>
          </>
        )}
        {/* Billing Information */}
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
          Billing Information
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
          <TextField
            label="Total Misc. & Other Fees"
            type="number"
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
            value={formData.totalMisc}
            onChange={(e) => handleFormChange("totalMisc", e.target.value)}
          />
          <TextField
            label="Subsidized by School"
            type="number"
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
            value={formData.subsidized}
            onChange={(e) => handleFormChange("subsidized", e.target.value)}
          />
          <TextField
            label="Full Payment"
            type="number"
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
            value={formData.fullPayment}
            onChange={(e) => handleFormChange("fullPayment", e.target.value)}
          />
        </Box>
        {/* Add Billing Button */}
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            color="primary"
            size="medium"
            disabled={formLoading}
            onClick={handleAddBilling}
            sx={{ px: 5, py: 1.2, fontWeight: "bold", borderRadius: 2 }}
          >
            {formLoading ? <CircularProgress size={24} /> : "+ Add Billing"}
          </Button>
        </Box>
      </Card>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Billing Records</Typography>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Student No."
              value={filterStudentNo}
              onChange={(e) => setFilterStudentNo(e.target.value)}
              size="small"
            />
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
                  <TableCell align="center">Actions</TableCell>
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
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => openEditDialog(r)} title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleAddPayment(r)} title="Add Payment">
                        <AddCardIcon/>
                      </IconButton>
                    </TableCell>
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
      <AddPaymentDialog
        open={openAddPayment}
        onClose={() => setOpenAddPayment(false)}
        billingData={addPaymentData}
      />
      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="md">
        <DialogTitle sx={{ fontWeight: "bold" }}>
          {editingRecord ? "Edit Billing" : "Add Billing"}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Card sx={{ p: 4, mb: 3, borderRadius: 3, boxShadow: 3 }}>
            {/* Student Information */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Student Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
              <Autocomplete
                sx={{ flex: 1, minWidth: 400 }}
                options={students}
                getOptionLabel={(option) =>
                  option
                    ? `${option.student_no} | ${option.last_name}, ${option.first_name} (${option.course})`
                    : ""
                }
                value={editFormData.student}
                onChange={(e, newVal) => handleFormChangeEdit("student", newVal)}
                loading={studentsLoading}
                renderInput={(params) => (
                  <TextField {...params} label="Select Student" size="small" fullWidth />
                )}
              />

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Semester</InputLabel>
                <Select
                  label="Semester"
                  value={editFormData.semester}
                  onChange={(e) => handleFormChangeEdit("semester", e.target.value)}
                >
                  {semesters.map((s) => (
                    <MenuItem key={s} value={s}>
                      {s}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>School Year</InputLabel>
                <Select
                  label="School Year"
                  value={editFormData.schoolYear}
                  onChange={(e) => handleFormChangeEdit("schoolYear", e.target.value)}
                >
                  {schoolYears.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Student Details */}
            {editFormData.student && (
              <>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                  Student Details
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3 }}>
                  <TextField
                    label="Student No."
                    size="small"
                    sx={{ flex: 1, minWidth: 220 }}
                    value={editFormData.student.student_no}
                    disabled
                  />
                  <TextField
                    label="Full Name"
                    size="small"
                    sx={{ flex: 2, minWidth: 300 }}
                    value={`${editFormData.student.last_name}, ${editFormData.student.first_name} ${
                      editFormData.student.middle_name || ""
                    }`}
                    disabled
                  />
                  <TextField
                    label="Course"
                    size="small"
                    sx={{ flex: 1, minWidth: 200 }}
                    value={editFormData.student.course}
                    disabled
                  />
                </Box>
              </>
            )}

            {/* Billing Information */}
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Billing Information
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 4 }}>
              <TextField
                label="Total Misc. & Other Fees"
                type="number"
                size="small"
                sx={{ flex: 1, minWidth: 220 }}
                value={editFormData.totalMisc}
                onChange={(e) => handleFormChangeEdit("totalMisc", e.target.value)}
              />
              <TextField
                label="Subsidized by School"
                type="number"
                size="small"
                sx={{ flex: 1, minWidth: 220 }}
                value={editFormData.subsidized}
                onChange={(e) => handleFormChangeEdit("subsidized", e.target.value)}
              />
              <TextField
                label="Full Payment"
                type="number"
                size="small"
                sx={{ flex: 1, minWidth: 220 }}
                value={editFormData.fullPayment}
                onChange={(e) => handleFormChangeEdit("fullPayment", e.target.value)}
              />
            </Box>

            {/* Save Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={handleSaveEdit}
                disabled={formLoading}
                sx={{ px: 5, py: 1.2, fontWeight: "bold", borderRadius: 2 }}
              >
                {formLoading ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : editingRecord ? (
                  "Update Billing"
                ) : (
                  "Add Billing"
                )}
              </Button>
            </Box>
          </Card>
        </DialogContent>
      </Dialog>
      {/* Confirm Delete Dialog */}
      <Dialog open={confirmDelete.open} onClose={() => setConfirmDelete({ open: false, id: null })}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent dividers>
          <Typography>Are you sure you want to delete this billing record?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete({ open: false, id: null })}>Cancel</Button>
          <Button color="error" variant="contained" onClick={confirmDeleteNow}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
