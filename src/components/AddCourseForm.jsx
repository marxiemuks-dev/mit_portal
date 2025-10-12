import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

export default function AddCourseForm({ onAddCourse }) {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    slots: "",
    teacher: "",
    time: "",
    day: "",
    room: "",
    semester: "",
    schoolYear: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.code || !formData.semester || !formData.schoolYear) {
      alert("Please fill all required fields");
      return;
    }

    // Call parent handler
    onAddCourse({
      ...formData,
      id: Date.now(), // temporary unique ID
      students: [],   // initialize empty students list
    });

    // Reset
    setFormData({
      name: "",
      code: "",
      slots: "",
      teacher: "",
      time: "",
      day: "",
      room: "",
      semester: "",
      schoolYear: "",
    });
  };

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Add Course Offering
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Course Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                fullWidth
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Teacher"
                name="teacher"
                value={formData.teacher}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Available Slots"
                name="slots"
                type="number"
                value={formData.slots}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Day(s)"
                name="day"
                value={formData.day}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Room"
                name="room"
                value={formData.room}
                onChange={handleChange}
                fullWidth
              />
            </Grid>

            {/* Semester */}
            <Grid item xs={12} sm={3}>
              <TextField
                select
                label="Semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                fullWidth
                required
              >
                <MenuItem value="1st Semester">1st Semester</MenuItem>
                <MenuItem value="2nd Semester">2nd Semester</MenuItem>
                <MenuItem value="Summer">Summer</MenuItem>
              </TextField>
            </Grid>

            {/* School Year */}
            <Grid item xs={12} sm={3}>
              <TextField
                label="School Year"
                name="schoolYear"
                value={formData.schoolYear}
                onChange={handleChange}
                placeholder="2025-2026"
                fullWidth
                required
              />
            </Grid>

            {/* Submit */}
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Add Course
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
