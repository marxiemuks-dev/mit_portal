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
import ASSETS_URL from "../../API/ASSETS_URL";

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
  const dispatch = useDispatch();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [currentStudent, setCurrentStudent] = useState(null);
  // Fetch announcements
  const fetchAnnouncements = async () => {
    const storedUser = localStorage.getItem("mitportal_user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setCurrentStudent(parsedUser);

    try {
      const result = await dispatch(getAnnouncements());
      console.log("All Announcements:", result.data);

      if (result?.data) {
        const filtered = result.data.filter(
          (item) =>
            item.visibility === "ALL" ||
            item.visibility === "CASHIER"
        );

        console.log("Filtered Announcements:", filtered);
        setAnnouncements(filtered);
      }
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };


  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const unreadCount = announcements.filter((a) => !a.isRead)?.length;

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
          Announcements & Activities
        </Typography>
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
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {a.title}
                      </Typography>
                      <Typography variant="body2">{a.description}</Typography>
                      {a.photo_url && (
                        <Box mt={1}>
                          <img
                            src={`${ASSETS_URL}${a.photo_url}`}
                            alt="Announcement"
                            style={{ width: "100%", maxWidth: 400, borderRadius: 8 }}
                          />
                        </Box>
                      )}
                    </>
                  }
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
