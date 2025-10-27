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
  const [currentStudent, setCurrentStudent] = useState(null);
  const dispatch = useDispatch();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
    const fetchNotification = async () => {
      const storedUser = localStorage.getItem("mitportal_user");
      if (!storedUser) return;
  
      const parsedUser = JSON.parse(storedUser);
      setCurrentStudent(parsedUser);
  
      try {
        const result = await dispatch(getNotifications());
        console.log("All Notifications:", result.data);
  
        if (result?.data) {
          const filtered = result.data.filter(
            (item) =>
              item.target_type === "ALL" ||
              (item.target_type === "STUDENT" &&
                item.target_user_id === parsedUser.userStudentID ||
                item.target_user_id === null)
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

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) => (notif.notification_id === id ? { ...notif, read: true } : notif))
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
          <NotificationsIcon fontSize="large" />
        </Badge>
        <Typography variant="h4" fontWeight="bold" ml={2}>
          Notifications
        </Typography>
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
    </Box>
  );
}
