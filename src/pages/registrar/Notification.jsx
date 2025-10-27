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
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { addNotification, getNotifications, updateNotification } from "../../actions/notification";

// ---------------- Sample Notification Data ----------------
const initialNotifications = [
  {
    notification_id: 1,
    title: "New student enrolled",
    message: "Alice Santos joined CS101.",
    target_type: "ALL",
    target_user_id: null,
    read: false,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    target_type: "ALL",
    target_user_id: "",
  });
  const [editFormData, setEditFormData] = useState({
    notification_id: null,
    title: "",
    message: "",
    target_type: "ALL",
    target_user_id: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

    const fetchNotification = async () => {
      const storedUser = localStorage.getItem("mitportal_user");
      if (!storedUser) return;
  
      const parsedUser = JSON.parse(storedUser);
  
      try {
        const result = await dispatch(getNotifications());
        console.log("All Notifications:", result.data);
  
        if (result?.data) {
          const filtered = result.data.filter(
            (item) =>
              item.target_type === "ALL" ||
              item.target_type === "REGISTRAR"
          );
  
          console.log("Filtered Announcements:", filtered);
          setNotifications(filtered);
        }
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
      useEffect(() => {
        fetchNotification();
      }, []);

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  // ---------------- Handlers ----------------
  const handleChange = (e, isEdit = false) => {
    const setter = isEdit ? setEditFormData : setFormData;
    const state = isEdit ? editFormData : formData;
    setter({ ...state, [e.target.name]: e.target.value });
  };

  const handleChangeAdd = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  };


  const handleAdd = async () => {
    const { title, message, target_type, target_user_id } = formData;
    if (!title || !message || !target_type) {
      setSnackbar({ open: true, message: "All fields are required!", severity: "warning" });
      return;
    }
    setIsLoading(true)
    try {
      const result = await dispatch(addNotification(title, message, target_type, target_user_id, false))
      const newNotif = {
        notification_id: Date.now(),
        title,
        message,
        target_type,
        target_user_id: target_type === "USER" ? target_user_id : null,
        read: false,
      };
      setNotifications([newNotif, ...notifications]);
      setSnackbar({ open: true, message: "Notification added!", severity: "success" });
      setAddDialogOpen(false);
      fetchNotification();
      setFormData({ title: "", message: "", target_type: "ALL", target_user_id: "" });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to add notification.", severity: "error" });
    }finally{
      setIsLoading(false)
    }
  };

  const handleEdit = (notif) => {
    setEditFormData({
      notification_id: notif.notification_id,
      title: notif.title,
      message: notif.message,
      target_type: notif.target_type,
      target_user_id: notif.target_user_id || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    const { notification_id, title, message, target_type, target_user_id } = editFormData;
    if (!title || !message || !target_type) {
      setSnackbar({ open: true, message: "All fields are required!", severity: "warning" });
      return;
    }

    try {
      const result = await dispatch(updateNotification(notification_id, title, message, target_type, target_user_id, false))
      console.log(result)
      setNotifications(
        notifications.map((n) =>
          n.notification_id === notification_id
            ? { ...n, title, message, target_type, target_user_id: target_type === "USER" ? target_user_id : null }
            : n
        )
      );
      fetchNotification()
      setSnackbar({ open: true, message: "Notification updated!", severity: "success" });
      setEditDialogOpen(false);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update notification.", severity: "error" });
    }
  };

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) => (notif.notification_id === id ? { ...notif, read: true } : notif))
    );
  };

  const deleteNotification = (id) => {
    if (window.confirm("Are you sure you want to delete this notification?")) {
      setNotifications(notifications.filter((notif) => notif.notification_id !== id));
    }
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
          <NotificationsIcon fontSize="large" />
        </Badge>
        <Typography variant="h4" fontWeight="bold" ml={2}>
          Notifications
        </Typography>
        <Button variant="contained" sx={{ ml: "auto" }} onClick={() => setAddDialogOpen(true)}>
          Add Notification
        </Button>
      </Box>
      {/* Notification List */}
      <Paper elevation={2}>
        <List>
          {notifications.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications." />
            </ListItem>
          )}

          {notifications.map((notif) => (
            <React.Fragment key={notif.notification_id}>
              <ListItem
                sx={{
                  backgroundColor: notif.read ? "#fff" : "#e3f2fd",
                  "&:hover": { bgcolor: "#f1f1f1" },
                }}
                secondaryAction={
                  <Box>
                    {!notif.read && (
                      <IconButton onClick={() => markAsRead(notif.notification_id)}>
                        <DoneIcon color="primary" />
                      </IconButton>
                    )}
                  </Box>
                }
              >
                <ListItemText
                  primary={notif.title}
                  secondary={notif.message}
                  primaryTypographyProps={{
                    fontWeight: notif.read ? "normal" : "bold",
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
        <DialogTitle>Add Notification</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={1}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChangeAdd}
              fullWidth
            />
            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChangeAdd}
              fullWidth
            />
            <TextField
              select
              label="Target Type"
              name="target_type"
              value={formData.target_type}
              onChange={handleChangeAdd}
            >
              {["ALL", "FACULTY", "STUDENT", "ADMIN", "REGISTRAR", "CASHIER"].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            {formData.target_type === "USER" && (
              <TextField
                label="Target User ID"
                name="target_user_id"
                type="number"
                value={formData.target_user_id}
                onChange={handleChangeAdd}
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
            disabled={isLoading} // disable button while loading
            startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
              >
                {isLoading ? "Saving..." : "Save"}
          </Button>

        </DialogActions>
      </Dialog>

      {/* ✏️ Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Notification</DialogTitle>
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
              label="Message"
              name="message"
              value={editFormData.message}
              onChange={(e) => handleChange(e, true)}
              fullWidth
            />
            <TextField
              select
              label="Target Type"
              name="target_type"
              value={editFormData.target_type}
              onChange={(e) => handleChange(e, true)}
            >
              {["ALL", "USER", "FACULTY", "STUDENT"].map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
            {editFormData.target_type === "USER" && (
              <TextField
                label="Target User ID"
                name="target_user_id"
                type="number"
                value={editFormData.target_user_id}
                onChange={(e) => handleChange(e, true)}
                fullWidth
              />
            )}
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
