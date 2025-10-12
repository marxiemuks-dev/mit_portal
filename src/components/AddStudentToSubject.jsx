import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
  Autocomplete,
  Typography,
} from "@mui/material";

const AddStudentToSubjectDialog = ({
  open,
  onClose,
  onSave,
  loading,
  students = [],
  subjects,
  selectedStudentSubject,
  setStudentSubjectData,
  studentSubjectData,
}) => {

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {selectedStudentSubject ? "Edit Student Subject" : "Add Student to Subject"}
      </DialogTitle>

      <DialogContent sx={{ display: "grid", gap: 2, mt: 1 }}>
        {/* 📚 Student Name */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Student
          </Typography>
          <Autocomplete
            options={students}
            value={
              students.find((s) => s.id === studentSubjectData.id) || null
            }
            onChange={(e, newValue) =>{
                setStudentSubjectData({
                ...studentSubjectData,
                studentId: newValue ? newValue.id : "",
              })
            }
            }
            getOptionLabel={(option) => `${option.students.student_no} | ${option.students.last_name}, ${option.students.first_name} ${option.students.middle_name} (${option.current_course})` || ""}
            renderInput={(params) => (
              <TextField {...params} label="Select Student" fullWidth />
            )}
          />
        </Box>

        {/* 📘 Subject */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Subject
          </Typography>
          <TextField label="Selected Subject" fullWidth value={`${subjects?.descriptiveTitle} ${subjects?.subjectCode}` || null} />
        </Box>

        {/* 📆 School Year */}
        <TextField
          disabled
          label="School Year"
          select
          SelectProps={{ native: true }}
          value={studentSubjectData.schoolYear}
          onChange={(e) =>
            setStudentSubjectData({
              ...studentSubjectData,
              schoolYear: e.target.value,
            })
          }
        >
          <option value="">Select School Year</option>
          <option value="2024-2025">2024-2025</option>
          <option value="2025-2026">2025-2026</option>
          <option value="2026-2027">2026-2027</option>
        </TextField>
        {/* 🗓 Semester */}
        <TextField
          disabled
          label="Semester"
          select
          SelectProps={{ native: true }}
          value={studentSubjectData.semester}
          onChange={(e) =>
            setStudentSubjectData({
              ...studentSubjectData,
              semester: e.target.value,
            })
          }
        >
          <option value="">Select Semester</option>
          <option value="1st Semester">1st Semester</option>
          <option value="2nd Semester">2nd Semester</option>
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={onSave} disabled={loading}>
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : selectedStudentSubject ? (
            "Update"
          ) : (
            "Add"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStudentToSubjectDialog;
