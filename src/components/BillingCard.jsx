import React from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Button,
  Divider,
} from "@mui/material";

const BillingCard = ({
  students,
  studentsLoading,
  formData,
  semesters,
  schoolYears,
  handleFormChange,
  handleAddBilling,
}) => {
  return (
    <Card sx={{ p: 4, boxShadow: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🧾 Add New Billing Record
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* 📚 Student Selection */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            Select Student
          </Typography>
          <Autocomplete
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
              <TextField {...params} label="Student" fullWidth size="small" />
            )}
          />
        </Grid>

        {/* 🗓 Semester */}
        <Grid item xs={6} md={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            Semester
          </Typography>
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

        {/* 📆 School Year */}
        <Grid item xs={6} md={3}>
          <Typography variant="subtitle1" gutterBottom fontWeight="500">
            School Year
          </Typography>
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

        {/* 📄 Student Info */}
        <Grid item xs={12}>
          <Box
            sx={{
              p: 2,
              bgcolor: "#f9f9f9",
              borderRadius: 2,
              border: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="subtitle1" fontWeight="500" gutterBottom>
              👤 Student Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <TextField
                  label="Student No."
                  size="small"
                  fullWidth
                  value={formData.student ? formData.student.student_no : ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Full Name"
                  size="small"
                  fullWidth
                  value={
                    formData.student
                      ? `${formData.student.last_name}, ${formData.student.first_name} ${formData.student.middle_name || ""}`
                      : ""
                  }
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Course"
                  size="small"
                  fullWidth
                  value={formData.student ? formData.student.course : ""}
                  disabled
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  label="Year & Section"
                  size="small"
                  fullWidth
                  value={formData.student ? formData.student.year_level : ""}
                  disabled
                />
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {/* 💸 Billing Inputs */}
        <Grid item xs={12}>
          <Typography
            variant="subtitle1"
            fontWeight="500"
            gutterBottom
            sx={{ mt: 3 }}
          >
            💵 Billing Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Total Misc. & Other Fees"
                type="number"
                size="small"
                fullWidth
                value={formData.totalMisc}
                onChange={(e) => handleFormChange("totalMisc", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Previous Balance"
                type="number"
                size="small"
                fullWidth
                value={formData.prevBalance}
                onChange={(e) => handleFormChange("prevBalance", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Subsidized by School"
                type="number"
                size="small"
                fullWidth
                value={formData.subsidized}
                onChange={(e) => handleFormChange("subsidized", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="Full Payment"
                type="number"
                size="small"
                fullWidth
                value={formData.fullPayment}
                onChange={(e) => handleFormChange("fullPayment", e.target.value)}
              />
            </Grid>
          </Grid>
        </Grid>

        {/* ✅ Add Button */}
        <Grid item xs={12} textAlign="right" sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleAddBilling}
            sx={{ px: 4, borderRadius: 2 }}
          >
            ➕ Add Billing
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

export default BillingCard;
