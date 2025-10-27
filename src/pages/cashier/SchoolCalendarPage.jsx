import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import SchoolCalendar from "../../components/SchoolCalendar";
import { useDispatch } from 'react-redux';
import { addCalendarEvent, deleteCalendarEvent, getCalendarEvents, updateCalendarEvent } from "../../actions/calendar";


const semesters = ["1st Semester", "2nd Semester", "Summer"];
const schoolYears = ["2024-2025", "2025-2026", "2026-2027"];
const SchoolCalendarPage = () => {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_type: "",
    start_date: "",
    end_date: "",
    semester: "",
    school_year: "",
    status: "Active",
    visibility: "ALL",
    created_by: 1,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch events
  const fetchEvents = async () => {
    try {
      const result = await dispatch(getCalendarEvents());
      setEvents(result.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  // Open dialog for editing
  const handleEdit = (event) => {
    setFormData({
      title: event.title,
      description: event.description,
      event_type: event.event_type,
      start_date: event.start_date,
      end_date: event.end_date,
      semester: event.semester,
      school_year: event.school_year,
      status: event.status,
      visibility: event.visibility,
      created_by: event.created_by,
    });
    setSelectedEventId(event.school_calendar_id);
    setEditMode(true);
    setOpen(true);
  };

  // Save or Update event
  const handleSave = async () => {
    try {
      const storedUser = localStorage.getItem("mitportal_user");
      if (!storedUser) return;

      if (
        !formData.title ||
        !formData.description ||
        !formData.event_type ||
        !formData.start_date ||
        !formData.end_date
      ) {
        setSnackbar({
          open: true,
          message: "All fields are required!",
          severity: "warning",
        });
        return;
      }

      setIsLoading(true);
      const parsedUser = JSON.parse(storedUser);

      let result;
      if (editMode) {
        // ✅ Update event
        result = await dispatch(
          updateCalendarEvent(
            selectedEventId,
            formData.title,
            formData.description,
            formData.event_type,
            formData.start_date,
            formData.end_date,
            formData.semester,
            formData.school_year,
            formData.status,
            formData.visibility,
            parsedUser.user_id
          )
        );
      } else {
        // ✅ Add event
        result = await dispatch(
          addCalendarEvent(
            formData.title,
            formData.description,
            formData.event_type,
            formData.start_date,
            formData.end_date,
            formData.semester,
            formData.school_year,
            formData.status,
            formData.visibility,
            parsedUser.user_id
          )
        );
      }
      if (result.status === true) {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
      } else {
        setSnackbar({
          open: true,
          message: result.message,
          severity: "error",
        });
      }

      fetchEvents();
      setOpen(false);
      setEditMode(false);
      setSelectedEventId(null);
      setFormData({
        title: "",
        description: "",
        event_type: "",
        start_date: "",
        end_date: "",
        semester: "",
        school_year: "",
        status: "Active",
        visibility: "Public",
        created_by: 1,
      });
    } catch (err) {
      console.error("Error saving event:", err);
      setSnackbar({ open: true, message: err, severity: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const result = await dispatch(deleteCalendarEvent(id))
        console.log(result)
        setSnackbar({
          open: true,
          message: result.message,
          severity: "success",
        });
        fetchEvents();
      } catch (err) {
        console.error("Error deleting event:", err);
      }
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Main Flex Layout */}
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 3,
        }}
      >
        {/* LEFT SECTION */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 3 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", flex: 1 }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" fontWeight="bold">
                  School Calendar Events
                </Typography>
                <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
                  Add Event
                </Button>
              </Box>

              {/* Event Table */}
              <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: "none" }}>
                <Table size="small">
                  <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>Title</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Start</TableCell>
                      <TableCell>End</TableCell>
                      <TableCell>Semester</TableCell>
                      <TableCell>School Year</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Visibility</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {events.length > 0 ? (
                      events.map((e) => (
                        <TableRow key={e.school_calendar_id} hover>
                          <TableCell>{e.title}</TableCell>
                          <TableCell>{e.event_type}</TableCell>
                          <TableCell>{e.start_date}</TableCell>
                          <TableCell>{e.end_date}</TableCell>
                          <TableCell>{e.semester}</TableCell>
                          <TableCell>{e.school_year}</TableCell>
                          <TableCell>{e.status}</TableCell>
                          <TableCell>{e.visibility}</TableCell>
                          <TableCell align="center">
                            <Button
                              color="contained"
                              size="small"
                              onClick={() => handleEdit(e)}
                              sx={{ mr: 1 }}
                            >
                            <IconButton color="primary" size="small" onClick={() => handleEdit(e)} title="Edit">
                              <EditIcon />
                            </IconButton>
                            </Button>
                            <Button
                              color="error"
                              size="small"
                              onClick={() => handleDelete(e.school_calendar_id)}
                            >
                            <IconButton color="primary" size="small" onClick={() => handleDelete(e.school_calendar_id)} title="Delete">
                              <DeleteIcon />
                            </IconButton>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} align="center">
                          No events found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Box>

        {/* RIGHT SECTION */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent>
              <SchoolCalendar
                calendarData ={events}
              />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* ➕ Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editMode ? "Update Calendar Event" : "Add Calendar Event"}</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth />
            <TextField label="Event Type" name="event_type" select value={formData.event_type} onChange={handleChange}>
              {["Academic", "Holiday", "Activity", "Deadline", "Meeting"].map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <TextField label="Start Date" name="start_date" type="date" value={formData.start_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField label="End Date" name="end_date" type="date" value={formData.end_date} onChange={handleChange} InputLabelProps={{ shrink: true }} />
            <TextField select label="Semester" name="semester" value={formData.semester} onChange={handleChange} fullWidth>
              {semesters.map((s) => (<MenuItem key={s} value={s}>{s}</MenuItem>))}
            </TextField>
            <TextField select label="School Year" name="school_year" value={formData.school_year} onChange={handleChange} fullWidth>
              {schoolYears.map((sy) => (<MenuItem key={sy} value={sy}>{sy}</MenuItem>))}
            </TextField>
            <TextField label="Visibility" name="visibility" select value={formData.visibility} onChange={handleChange}>
              {["ALL", "FACULTY", "STUDENT", "ADMIN", "REGISTRAR", "CASHIER"].map((v) => (<MenuItem key={v} value={v}>{v}</MenuItem>))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isLoading ? (editMode ? "Updating..." : "Saving...") : (editMode ? "Update" : "Save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};


export default SchoolCalendarPage;
