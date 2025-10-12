import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Badge,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import DoneIcon from "@mui/icons-material/Done";
import DeleteIcon from "@mui/icons-material/Delete";

// ---------------- Sample Notification Data ----------------
const initialNotifications = [
  { id: 1, title: "New student enrolled", description: "Alice Santos joined CS101.", read: false },
  { id: 2, title: "Grade submitted", description: "Prof. Jane Smith submitted IT202 grades.", read: false },
  { id: 3, title: "Reminder", description: "Faculty meeting at 3 PM today.", read: true },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Mark a notification as read
  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(notifications.filter((notif) => notif.id !== id));
  };

  const unreadCount = notifications.filter((notif) => !notif.read).length;

  return (
    <Box sx={{ p: 3, minHeight: "100vh", bgcolor: "#f4f6f8" }}>
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
            <React.Fragment key={notif.id}>
              <ListItem
                sx={{
                  backgroundColor: notif.read ? "#fff" : "#e3f2fd",
                  "&:hover": { bgcolor: "#f1f1f1" },
                }}
                secondaryAction={
                  <Box>
                    {!notif.read && (
                      <IconButton
                        edge="end"
                        aria-label="mark as read"
                        onClick={() => markAsRead(notif.id)}
                      >
                        <DoneIcon color="primary" />
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteNotification(notif.id)}
                    >
                      <DeleteIcon color="error" />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={notif.title}
                  secondary={notif.description}
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

      {/* Clear All Button */}
      {notifications.length > 0 && (
        <Box sx={{ mt: 2, textAlign: "right" }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setNotifications([])}
          >
            Clear All
          </Button>
        </Box>
      )}
    </Box>
  );
}
