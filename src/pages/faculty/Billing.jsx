import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
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
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";

// Replace with your actual action import (if available)
import { getAllStudents } from "../../actions/student";
import BillingCard from "../../components/BillingCard";

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
  const [editingRecord, setEditingRecord] = useState(null); // null => add; otherwise edit

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

  // view breakdown dialog
  const [openBreakdown, setOpenBreakdown] = useState(false);
  const [breakdownData, setBreakdownData] = useState(null);

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

  // helpers
  const resetForm = () => {
    setFormData(initialForm);
    setEditingRecord(null);
  };

  const openAddDialog = () => {
    resetForm();
    setOpenDialog(true);
  };

  const openEditDialog = (record) => {
    // prefill form with record
    const studentObj = students.find((s) => s.id === record.studentId) || null;
    setFormData({
      student: studentObj,
      semester: record.semester || semesters[0],
      schoolYear: record.schoolYear || schoolYears[0],
      totalMisc: record.totalMisc ?? "",
      prevBalance: record.prevBalance ?? "",
      subsidized: record.subsidized ?? "",
      fullPayment: record.fullPayment ?? "",
      breakdown: record.breakdown || initialForm.breakdown,
    });
    setEditingRecord(record);
    setOpenDialog(true);
  };

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBreakdownChange = (key, value) => {
    setFormData((prev) => ({ ...prev, breakdown: { ...prev.breakdown, [key]: value } }));
  };

  // Save (add or update)
  const handleSave = async () => {
    // basic validation
    if (!formData.student) {
      setSnackbar({ open: true, message: "Select a student", severity: "warning" });
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
        setBillingRecords((prev) => [newRec, ...prev]);
        setSnackbar({ open: true, message: "Billing added", severity: "success" });
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

  const handleDelete = (id) => {
    setConfirmDelete({ open: true, id });
  };

  const confirmDeleteNow = () => {
    const { id } = confirmDelete;
    setBillingRecords((prev) => prev.filter((r) => r.id !== id));
    setConfirmDelete({ open: false, id: null });
    setSnackbar({ open: true, message: "Billing deleted", severity: "info" });
  };

  const handleViewBreakdown = (record) => {
    setBreakdownData(record.breakdown || null);
    setOpenBreakdown(true);
  };

  // export to pdf
  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Billing Records", 14, 20);

    const body = billingRecords.map((r, i) => [
      i + 1,
      r.student_no,
      r.fullName,
      r.course,
      r.yearLevel,
      r.semester,
      r.schoolYear,
      `₱ ${Number(r.totalMisc).toLocaleString()}`,
      `₱ ${Number(r.prevBalance).toLocaleString()}`,
      `₱ ${Number(r.subsidized).toLocaleString()}`,
      `₱ ${Number(r.fullPayment).toLocaleString()}`,
    ]);

    doc.autoTable({
      startY: 30,
      head: [
        [
          "#",
          "Student No.",
          "Full Name",
          "Course",
          "Year",
          "Semester",
          "School Year",
          "Total Misc",
          "Prev Bal",
          "Subsidized",
          "Full Payment",
        ],
      ],
      body,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [22, 160, 133] },
    });

    doc.save("Billing_Records.pdf");
  };

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

        {/* Student Details */}
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
            label="Previous Balance"
            type="number"
            size="small"
            sx={{ flex: 1, minWidth: 220 }}
            value={formData.prevBalance}
            onChange={(e) => handleFormChange("prevBalance", e.target.value)}
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
            // onClick={handleAddBilling}
            sx={{ px: 5, py: 1.2, fontWeight: "bold", borderRadius: 2 }}
          >
            + Add Billing
          </Button>
        </Box>
      </Card>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Billing Records</Typography>
            <Box>
              <Button variant="outlined" sx={{ mr: 1 }} onClick={() => setBillingRecords([])}>
                Clear All
              </Button>
              <Button variant="contained" color="secondary" onClick={handleExportPDF}>
                Export to PDF
              </Button>
            </Box>
          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Student No.</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Year</TableCell>
                  <TableCell>Semester</TableCell>
                  <TableCell>School Year</TableCell>
                  <TableCell align="right">Total Misc</TableCell>
                  <TableCell align="right">Prev Balance</TableCell>
                  <TableCell align="right">Subsidized</TableCell>
                  <TableCell align="right">Full Payment</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {billingRecords.map((r, idx) => (
                  <TableRow key={r.id} hover>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{r.student_no}</TableCell>
                    <TableCell>{r.fullName}</TableCell>
                    <TableCell>{r.course}</TableCell>
                    <TableCell>{r.yearLevel}</TableCell>
                    <TableCell>{r.semester}</TableCell>
                    <TableCell>{r.schoolYear}</TableCell>
                    <TableCell align="right">₱ {Number(r.totalMisc).toLocaleString()}</TableCell>
                    <TableCell align="right">₱ {Number(r.prevBalance).toLocaleString()}</TableCell>
                    <TableCell align="right">₱ {Number(r.subsidized).toLocaleString()}</TableCell>
                    <TableCell align="right">₱ {Number(r.fullPayment).toLocaleString()}</TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleViewBreakdown(r)} title="View Breakdown">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => openEditDialog(r)} title="Edit">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(r.id)} title="Delete">
                        <DeleteIcon />
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
      {/* Add / Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{minWidth:'70vw'}} fullWidth>
        <DialogTitle>
          {editingRecord ? "Edit Billing" : "Add Billing"}
          <IconButton
            aria-label="close"
            onClick={() => setOpenDialog(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{minWidth:'70vw'}}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Autocomplete
                sx={{minWidth:'500px'}}
                options={students}
                getOptionLabel={(option) =>
                  option ? `${option.student_no} | ${option.last_name}, ${option.first_name} (${option.course})` : ""
                }
                value={formData.student}
                onChange={(e, newVal) => handleFormChange("student", newVal)}
                loading={studentsLoading}
                renderInput={(params) => (
                  <TextField {...params} label="Select Student" fullWidth size="small" />
                )}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
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
            </Grid>

            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small">
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
            </Grid>
            {/* Student Details Display */}
            <Grid item xs={12} md={12}>
              <Typography variant="subtitle2" gutterBottom>
                Student Details
              </Typography>
              <Box sx={{ display: "grid", gap: 1 }}>
                <TextField
                  label="Student No."
                  size="small"
                  value={formData.student ? formData.student.student_no : ""}
                  disabled
                />
                <TextField
                  label="Full Name"
                  size="small"
                  value={formData.student ? `${formData.student.last_name}, ${formData.student.first_name} ${formData.student.middle_name || ""}` : ""}
                  disabled
                />
                <TextField
                  label="Course"
                  size="small"
                  value={formData.student ? formData.student.course : ""}
                  disabled
                />
                <TextField
                  label="Year & Section"
                  size="small"
                  value={formData.student ? formData.student.year_level : ""}
                  disabled
                />
              </Box>
            </Grid>
            {/* Billing Inputs */}
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" gutterBottom>
                Billing Inputs
              </Typography>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Total Misc. & Other Fees"
                    type="number"
                    size="small"
                    fullWidth
                    value={formData.totalMisc}
                    onChange={(e) => handleFormChange("totalMisc", e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Previous Balance"
                    type="number"
                    size="small"
                    fullWidth
                    value={formData.prevBalance}
                    onChange={(e) => handleFormChange("prevBalance", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Subsidized by School"
                    type="number"
                    size="small"
                    fullWidth
                    value={formData.subsidized}
                    onChange={(e) => handleFormChange("subsidized", e.target.value)}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Payment"
                    type="number"
                    size="small"
                    fullWidth
                    value={formData.fullPayment}
                    onChange={(e) => handleFormChange("fullPayment", e.target.value)}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <Divider />
                  <Typography variant="subtitle2" sx={{ mt: 1 }}>
                    Breakdown (optional)
                  </Typography>
                  <Grid container spacing={1} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Registration"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.breakdown.registration}
                        onChange={(e) => handleBreakdownChange("registration", e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Library"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.breakdown.library}
                        onChange={(e) => handleBreakdownChange("library", e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Laboratory"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.breakdown.laboratory || formData.breakdown.other || ""}
                        onChange={(e) => handleBreakdownChange("laboratory", e.target.value)}
                      />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Other (misc)"
                        type="number"
                        fullWidth
                        size="small"
                        value={formData.breakdown.other || ""}
                        onChange={(e) => handleBreakdownChange("other", e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </Grid> */}
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={formLoading}>
            {formLoading ? <CircularProgress size={20} /> : editingRecord ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Breakdown Dialog */}
      <Dialog open={openBreakdown} onClose={() => setOpenBreakdown(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          Fee Breakdown
          <IconButton
            aria-label="close"
            onClick={() => setOpenBreakdown(false)}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {breakdownData ? (
            <Box sx={{ display: "grid", gap: 1 }}>
              {Object.entries(breakdownData).map(([k, v]) => (
                <Box key={k} display="flex" justifyContent="space-between">
                  <Typography>{k.replace(/([A-Z])/g, " $1")}</Typography>
                  <Typography>₱ {Number(v || 0).toLocaleString()}</Typography>
                </Box>
              ))}
            </Box>
          ) : (
            <Typography color="text.secondary">No breakdown available.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenBreakdown(false)}>Close</Button>
        </DialogActions>
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
