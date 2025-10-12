import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  Typography,
  Divider,
  MenuItem,
  Box,
} from "@mui/material";

const students = [
  { id: 1, name: "Alice Santos" },
  { id: 2, name: "Mark Rivera" },
  { id: 3, name: "Jenny Cruz" },
];

const semesters = ["1st Semester", "2nd Semester", "Summer"];

const BillingFormDialog = ({ open, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    student: "",
    semester: "",
    schoolYear: "",
    totalMisc: "",
    prevBalance: "",
    subsidized: "",
    fullPayment: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>📚 Billing Details Form</DialogTitle>
      <DialogContent dividers>
        <Typography variant="h6" gutterBottom>
          Billing Information
        </Typography>

        <Grid container spacing={2}>
          {/* Student Selection */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Select Student"
              value={formData.student}
              onChange={(e) => handleChange("student", e.target.value)}
            >
              {students.map((s) => (
                <MenuItem key={s.id} value={s.name}>
                  {s.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Semester Selection */}
          <Grid item xs={12} sm={6}>
            <TextField
              select
              fullWidth
              label="Semester"
              value={formData.semester}
              onChange={(e) => handleChange("semester", e.target.value)}
            >
              {semesters.map((sem, i) => (
                <MenuItem key={i} value={sem}>
                  {sem}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* School Year */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="School Year (e.g., 2025-2026)"
              value={formData.schoolYear}
              onChange={(e) => handleChange("schoolYear", e.target.value)}
            />
          </Grid>

          {/* Total Miscellaneous Fees */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Total Misc. & Other Fees"
              value={formData.totalMisc}
              onChange={(e) => handleChange("totalMisc", e.target.value)}
            />
          </Grid>

          {/* Previous Balance */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Previous Balance"
              value={formData.prevBalance}
              onChange={(e) => handleChange("prevBalance", e.target.value)}
            />
          </Grid>

          {/* Subsidized by School */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Subsidized by School"
              value={formData.subsidized}
              onChange={(e) => handleChange("subsidized", e.target.value)}
            />
          </Grid>

          {/* Full Payment */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              type="number"
              label="Full Payment"
              value={formData.fullPayment}
              onChange={(e) => handleChange("fullPayment", e.target.value)}
            />
          </Grid>
        </Grid>

        <Box mt={3}>
          <Typography variant="body2" color="textSecondary">
            📌 Note: Assessment is subject to final review and approval by the
            Assistant Director for Finance.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BillingFormDialog;
