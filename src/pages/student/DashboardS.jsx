import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Divider,
  ListItem,
  ListItemText,
  List,
  Paper,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import TodayIcon from "@mui/icons-material/Today";
import PaymentIcon from "@mui/icons-material/Payment";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { getAllEnrollments } from "../../actions/enrollment";
import { useDispatch } from "react-redux";
import SchoolCalendar from "../../components/SchoolCalendar";
import { getAllStudents } from "../../actions/student";
import { getNotifications } from "../../actions/notification";
import { getAnnouncements } from "../../actions/announcement";
import ASSETS_URL from "../../API/ASSETS_URL";

const stats = [
  { title: "Payments Processed", value: "₱ 12,500", icon: <PaymentIcon fontSize="large" color="primary" /> },
];

export default function Dashboard() {
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [studentList, setStudentList] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const fetchAnnouncements = async () => {
        const storedUser = localStorage.getItem("mitportal_user");
        if (!storedUser) return;
    
        try {
          const result = await dispatch(getAnnouncements());
          console.log("All Announcements:", result.data);
    
          if (result?.data) {
            const filtered = result.data.filter(
              (item) =>
              (item.visibility === "ALL" || item.visibility === "STUDENT") &&
                item.photo_url !== null
            );
    
            console.log("Filtered Announcements:", filtered);
            setAnnouncements(filtered);
          }
        } catch (err) {
          console.error("Error fetching announcements:", err);
        }
      };

  const fetchEnrollments = async () => {
    const result = await dispatch(getAllEnrollments());
    const result1 = await dispatch(getAllStudents());
    if (result.status === true) {
      setEnrollments(result?.data || [0]);
    }
    setStudentList(result1?.data || [0])
  };
      const fetchNotification = async () => {
        try {
          const result = await dispatch(getNotifications());
          setNotifications(result?.data || [0])
          console.log(result)
        } catch (err) {
          console.error("Error fetching events:", err);
        }
      };

  useEffect(() => {
    fetchEnrollments();
    fetchNotification();
    fetchAnnouncements();
  }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      {/* Section 1: Stats */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          mb: 3,
        }}
      >
        {/* Total Students */}
        <Card sx={{ display: "flex", alignItems: "center", p: 2, flex: "1 1 200px", boxShadow: 3 }}>
          <Box sx={{ mr: 2 }}>
            <SchoolIcon fontSize="large" color="primary" />
          </Box>
          <Box>
            <Typography variant="subtitle1">Total Students</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {studentList.length}
            </Typography>
          </Box>
        </Card>
        <Card sx={{ display: "flex", alignItems: "center", p: 2, flex: "1 1 200px", boxShadow: 3 }}>
          <Box sx={{ mr: 2 }}>
            <SchoolIcon fontSize="large" color="primary" />
          </Box>
          <Box>
            <Typography variant="subtitle1">Enrolled</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {enrollments.length}
            </Typography>
          </Box>
        </Card>
        <Card sx={{ display: "flex", alignItems: "center", p: 2, flex: "1 1 200px", boxShadow: 3 }}>
          <Box sx={{ mr: 2 }}>
            <AnnouncementIcon fontSize="large" color="primary" />
          </Box>
          <Box>
            <Typography variant="subtitle1">Announcements</Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              {announcements.length}
            </Typography>
          </Box>
        </Card>
        {/* Other Stats */}
        {stats.map((stat, index) => (
          <Card
            key={index}
            sx={{ display: "flex", alignItems: "center", p: 2, flex: "1 1 200px", boxShadow: 3 }}
          >
            <Box sx={{ mr: 2 }}>{stat.icon}</Box>
            <Box>
              <Typography variant="subtitle1">{stat.title}</Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                {stat.value}
              </Typography>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Section 2: Calendar + Quick Summary */}
            <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 2,
          }}
        >
          {/* 🟢 Announcements Section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              📢 Announcements
            </Typography>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <List>
                {announcements?.filter(a => a.type === "Announcement").length === 0 && (
                  <ListItem>
                    <ListItemText primary="No announcements found." />
                  </ListItem>
                )}

                {announcements
                  ?.filter(a => a.type === "Announcement")
                  .map((a) => (
                    <React.Fragment key={a.id}>
                      <ListItem
                        sx={{
                          backgroundColor: a.isRead ? "#fff" : "#e3f2fd",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          px: 2,
                          py: 1.5,
                          "&:hover": { bgcolor: "#f9f9f9" },
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {a.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {a.description}
                        </Typography>

                        {a.photo_url && (
                          <Box
                            mt={1.5}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={`${ASSETS_URL}${a.photo_url}`}
                              alt="Announcement"
                              style={{
                                width: "100%",
                                maxWidth: "350px",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        )}
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </Paper>
          </Box>

          {/* 🔵 Activities Section */}
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                fontWeight: "bold",
                color: "secondary.main",
                textAlign: "center",
              }}
            >
              🎯 Activities
            </Typography>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
              <List>
                {announcements?.filter(a => a.type === "Activity").length === 0 && (
                  <ListItem>
                    <ListItemText primary="No activities found." />
                  </ListItem>
                )}

                {announcements
                  ?.filter(a => a.type === "Activity")
                  .map((a) => (
                    <React.Fragment key={a.id}>
                      <ListItem
                        sx={{
                          backgroundColor: a.isRead ? "#fff" : "#e8f5e9",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          px: 2,
                          py: 1.5,
                          "&:hover": { bgcolor: "#f1f8e9" },
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {a.title}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {a.description}
                        </Typography>

                        {a.photo_url && (
                          <Box
                            mt={1.5}
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              width: "100%",
                            }}
                          >
                            <img
                              src={`${ASSETS_URL}${a.photo_url}`}
                              alt="Activity"
                              style={{
                                width: "100%",
                                maxWidth: "350px",
                                height: "200px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </Box>
                        )}
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))}
              </List>
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
