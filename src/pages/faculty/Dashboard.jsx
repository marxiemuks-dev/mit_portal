import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import SchoolIcon from "@mui/icons-material/School";
import TodayIcon from "@mui/icons-material/Today";
import PaymentIcon from "@mui/icons-material/Payment";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import { getAllEnrollments } from "../../actions/enrollment";
import { useDispatch } from "react-redux";

const budgetData = [
  { name: "Jan", budget: 5000 },
  { name: "Feb", budget: 3000 },
  { name: "Mar", budget: 7000 },
  { name: "Apr", budget: 4000 },
];

const stats = [
  { title: "Enrolled Today", value: 3, icon: <TodayIcon fontSize="large" color="primary" /> },
  { title: "Payments Processed", value: "₱ 12,500", icon: <PaymentIcon fontSize="large" color="primary" /> },
  { title: "Announcements", value: 7, icon: <AnnouncementIcon fontSize="large" color="primary" /> },
];

export default function Dashboard() {
    const dispatch = useDispatch();
    const [enrollments, setEnrollments] = useState([]);
    const fetchEnrollments = async () => {
      const result = await dispatch(getAllEnrollments());
      if (result.status === true) {
        setEnrollments(result.data);
      } else {
      }
    };
      useEffect(() => {
        fetchEnrollments();
      }, []);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>
      {/* Stats Cards */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
              <Box sx={{ mr: 2 }}><SchoolIcon fontSize="large" color="primary" /></Box>
              <Box>
                <Typography variant="subtitle1">Total Students</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {enrollments.length}
                </Typography>
              </Box>
            </Card>
          </Grid>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ display: "flex", alignItems: "center", p: 2, boxShadow: 3 }}>
              <Box sx={{ mr: 2 }}>{stat.icon}</Box>
              <Box>
                <Typography variant="subtitle1">{stat.title}</Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  {stat.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Chart + Quick Summary */}
      <Grid container spacing={2} sx={{ mt: 2 }}>
        <Grid item xs={12} md={8} flex={6}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Budget Overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={budgetData} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="budget" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Grid>
        <Grid item xs={12} md={4} flex={4}>
          <Card sx={{ p: 2, boxShadow: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Quick Summary
            </Typography>
            <Typography sx={{ mt: 1 }}>Total Programs: 12</Typography>
            <Typography sx={{ mt: 1 }}>Ongoing Projects: 5</Typography>
            <Typography sx={{ mt: 1 }}>Completed Trainings: 8</Typography>
            <Typography sx={{ mt: 1 }}>Compliance Rate: 95%</Typography>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
