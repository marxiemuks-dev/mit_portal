import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Badge,
  Paper,
  Divider,
  Button,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import CampaignIcon from "@mui/icons-material/Campaign";
import DoneIcon from "@mui/icons-material/Done";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import {
  addAnnouncement,
  getAnnouncements,
  updateAnnouncement,
} from "../../actions/announcement";

// ---------------- Sample Announcement Data ----------------
const initialAnnouncements = [
  {
    id: 1,
    title: "School Opening",
    description: "Classes will start on November 4.",
    visibility: "ALL",
    targetUser: null,
    isRead: false,
  },
];

export default function AnnouncementPage() {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visibility: "ALL",
    targetUser: "",
  });

  const [editFormData, setEditFormData] = useState({
    id: null,
    title: "",
    description: "",
    visibility: "ALL",
    targetUser: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Fetch announcements
  const fetchAnnouncements = async () => {
    try {
      const result = await dispatch(getAnnouncements());
      console.log(result)
      setAnnouncements(result.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const unreadCount = announcements.filter((a) => !a.isRead)?.length;

  // ---------------- Handlers ----------------
  const handleChange = (e, isEdit = false) => {
    console.log(e.target.name, e.target.value);
    const setter = isEdit ? setEditFormData : setFormData;
    const state = isEdit ? editFormData : formData;
    setter({ ...state, [e.target.name]: e.target.value });
  };

  const handleAdd = async () => {
    const { title, description, visibility, targetUser } = formData;
    if (!title || !description || !visibility) {
      setSnackbar({
        open: true,
        message: "All fields are required!",
        severity: "warning",
      });
      return;
    }
    setIsLoading(true);
    try {
      await dispatch(
        addAnnouncement(title, description, false, targetUser, visibility)
      );
      setSnackbar({
        open: true,
        message: "Announcement added successfully!",
        severity: "success",
      });
      setAddDialogOpen(false);
      fetchAnnouncements();
      setFormData({ title: "", description: "", visibility: "ALL", targetUser: "" });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to add announcement.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (a) => {
    setEditFormData({
      id: a.id,
      title: a.title,
      description: a.description,
      visibility: a.visibility,
      targetUser: a.targetUser || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const { id, title, description, visibility, targetUser } = editFormData;
    if (!title || !description || !visibility) {
      setSnackbar({
        open: true,
        message: "All fields are required!",
        severity: "warning",
      });
      return;
    }

    try {
      await dispatch(updateAnnouncement(id, title, description, false, targetUser, visibility));
      setSnackbar({
        open: true,
        message: "Announcement updated successfully!",
        severity: "success",
      });
      setEditDialogOpen(false);
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to update announcement.",
        severity: "error",
      });
    }
  };

  const markAsRead = (id) => {
    setAnnouncements(
      announcements.map((a) =>
        a.id === id ? { ...a, isRead: true } : a
      )
    );
  };

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f4f6f8" }}>
      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Badge badgeContent={unreadCount} color="error">
          <CampaignIcon fontSize="large" />
        </Badge>
        <Typography variant="h4" fontWeight="bold" ml={2}>
          Announcements
        </Typography>
        <Button variant="contained" sx={{ ml: "auto" }} onClick={() => setAddDialogOpen(true)}>
          Add Announcement
        </Button>
      </Box>

      {/* Announcement List */}
      <Paper elevation={2}>
        <List>
          {announcements.length === 0 && (
            <ListItem>
              <ListItemText primary="No announcements found." />
            </ListItem>
          )}

          {announcements.map((a) => (
            <React.Fragment key={a.id}>
              <ListItem
                sx={{
                  backgroundColor: a.isRead ? "#fff" : "#e3f2fd",
                  "&:hover": { bgcolor: "#f1f1f1" },
                }}
                secondaryAction={
                  <Box>
                    {!a.isRead && (
                      <IconButton onClick={() => markAsRead(a.id)}>
                        <DoneIcon color="primary" />
                      </IconButton>
                    )}
                    <IconButton onClick={() => handleEdit(a)}>
                      <EditIcon color="info" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={a.title}
                  secondary={a.description}
                  primaryTypographyProps={{
                    fontWeight: a.isRead ? "normal" : "bold",
                  }}
                />
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* ➕ Add Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Announcement</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={(e) => handleChange(e, false)}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange(e, false)}
              fullWidth
            />
            <TextField
              select
              label="Visibility"
              name="visibility"
              value={formData.visibility}
              onChange={(e) => handleChange(e, false)}
              fullWidth
            >
              {["ALL", "FACULTY", "STUDENT", "ADMIN", "REGISTRAR", "CASHIER"].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
            {formData.visibility === "USER" && (
              <TextField
                label="Target User ID"
                name="targetUser"
                type="number"
                value={formData.targetUser}
                onChange={(e) => handleChange(e, false)}
                fullWidth
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={isLoading}
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ✏️ Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Announcement</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={editFormData.title}
              onChange={(e) => handleChange(e, true)}
              fullWidth
            />
            <TextField
              label="Description"
              name="description"
              multiline
              rows={3}
              value={editFormData.description}
              onChange={(e) => handleChange(e, true)}
              fullWidth
            />
            <TextField
              select
              label="Visibility"
              name="visibility"
              value={editFormData.visibility}
              onChange={(e) => handleChange(e, true)}
            >
              {["ALL", "FACULTY", "STUDENT", "ADMIN", "REGISTRAR", "CASHIER"].map((v) => (
                <MenuItem key={v} value={v}>
                  {v}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
