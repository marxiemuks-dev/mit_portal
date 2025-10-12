import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { addSubjectOffering, getAllSubjectOffering } from "../actions/subjectOffering";


const semesters = ["1st Semester", "2nd Semester", "Summer"];
const schoolYears = ["2025-2026", "2026-2027", "2027-2028"];

export default function AddSubjectOfferingDialog({ open, onClose, onAdd, setData }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    subject_code: "",
    subject_name: "",
    units: "",
    semester: "",
    school_year: "",
    teacher: "",
    schedule: "",
    room: "",
    slots: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddOffering = async () => {
        setData((prev) => [...prev, formData]);

    // optional callback for parent logging
    onAdd(formData);
    // const result = await dispatch(addSubjectOffering(formData));
    // console.log(result)
    // if (result.status === true) {
    //   dispatch(getAllSubjectOffering()); // refresh the table
    //   onClose()
    // } else {

    // }
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Subject Offering</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {/* Subject Code */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Subject Code"
              name="subject_code"
              value={formData.subject_code}
              onChange={handleChange}
            />
          </Grid>

          {/* Subject Name */}
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="Subject Name"
              name="subject_name"
              value={formData.subject_name}
              onChange={handleChange}
            />
          </Grid>

          {/* Units */}
          <Grid item xs={6}>
            <TextField
              type="number"
              fullWidth
              label="Units"
              name="units"
              value={formData.units}
              onChange={handleChange}
            />
          </Grid>

          {/* Slots */}
          <Grid item xs={6}>
            <TextField
              type="number"
              fullWidth
              label="Slots"
              name="slots"
              value={formData.slots}
              onChange={handleChange}
            />
          </Grid>

          {/* Semester */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Semester"
              name="semester"
              value={formData.semester}
              onChange={handleChange}
              sx={{minWidth:'205px'}}
            >
              {semesters.map((sem, idx) => (
                <MenuItem key={idx} value={sem}>
                  {sem}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* School Year */}
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="School Year"
              name="school_year"
              value={formData.school_year}
              onChange={handleChange}
              sx={{minWidth:'205px'}}
            >
              {schoolYears.map((yr, idx) => (
                <MenuItem key={idx} value={yr}>
                  {yr}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          {/* Teacher */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Teacher"
              name="teacher"
              value={formData.teacher}
              onChange={handleChange}
            />
          </Grid>

          {/* Schedule */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Schedule"
              name="schedule"
              value={formData.schedule}
              onChange={handleChange}
              placeholder="e.g., Mon & Wed 9:00-10:30 AM"
            />
          </Grid>

          {/* Room */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Room"
              name="room"
              value={formData.room}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleAddOffering} variant="contained" color="primary">
          Add Offering
        </Button>
      </DialogActions>
    </Dialog>
  );
}
