import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
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
                item.visibility === "ALL" ||
                item.visibility === "REGISTRAR"
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
        {/* Calendar */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ borderRadius: 3, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent>
              <SchoolCalendar calendarData={events} />
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}
