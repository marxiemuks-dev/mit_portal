import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

export default function AddSubjectOfferingDialog({ open, onClose, onAdd, courses }) {
  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    units: 3,
    semester: "1st Semester",
    school_year: "2025-2026",
    teacher: "",
    schedule: "",
    room: "",
    slots: 30,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      subject_code: "",
      subject_name: "",
      units: 3,
      semester: "1st Semester",
      school_year: "2025-2026",
      teacher: "",
      schedule: "",
      room: "",
      slots: 30,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Subject Offering</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subject Code"
              name="subject_code"
              fullWidth
              value={formData.subject_code}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Subject Name"
              name="subject_name"
              fullWidth
              value={formData.subject_name}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Units"
              type="number"
              name="units"
              fullWidth
              value={formData.units}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Semester"
              name="semester"
              fullWidth
              value={formData.semester}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="School Year"
              name="school_year"
              fullWidth
              value={formData.school_year}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Teacher"
              name="teacher"
              fullWidth
              value={formData.teacher}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Schedule"
              name="schedule"
              fullWidth
              value={formData.schedule}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Room"
              name="room"
              fullWidth
              value={formData.room}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Slots"
              type="number"
              name="slots"
              fullWidth
              value={formData.slots}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}
