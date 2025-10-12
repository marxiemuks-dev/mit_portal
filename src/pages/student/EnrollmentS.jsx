import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Select,
  MenuItem,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { getEnrollmentById } from "../../actions/enrollment";
import { useNavigate } from "react-router-dom";

export default function Enrollment() {
  const [currentStudent, setCurrentStudent] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchEnrollment = async () => {
      const storedUser = localStorage.getItem("mitportal_user");
      if (!storedUser) {
        navigate("/signin");
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        const result = await dispatch(getEnrollmentById(parsedUser.userStudentID));
        if (result.status === true && result.data) {
          setCurrentStudent(result.data);
        } else {
          setCurrentStudent(null);
        }
      } catch (err) {
        console.error(err);
        navigate("/signin");
      }
    };

    fetchEnrollment();
  }, [dispatch, navigate]);

  if (!currentStudent) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          No enrollment data found.
        </Typography>
      </Box>
    );
  }

  const student = currentStudent.students;

  return (
    <Box
      sx={{
        bgcolor: "#f4f6f8",
        minHeight: "100vh",
        p: { xs: 2, sm: 4 },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Header */}
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: "primary.main",
          textAlign: "center",
          fontWeight: "bold",
        }}
      >
        Welcome, {student.last_name?.toUpperCase()}, {student.first_name}{" "}
        {student.middle_name} ({student.student_no})
      </Typography>

      {/* Info Card */}
      <Card
        sx={{
          width: "100%",
          maxWidth: 750,
          boxShadow: 4,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Student Name */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Student Name
              </Typography>
              <Typography fontWeight={600}>
                {student.last_name?.toUpperCase()}, {student.first_name}{" "}
                {student.middle_name}
              </Typography>
            </Box>

            {/* Student No */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Student No.
              </Typography>
              <Typography fontWeight={600}>{student.student_no}</Typography>
            </Box>

            {/* Program */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Program
              </Typography>
              <Typography fontWeight={600}>{currentStudent.current_course}</Typography>
            </Box>

            {/* School Year */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                School Year
              </Typography>
              <Typography fontWeight={600}>
                {currentStudent.current_school_year}
              </Typography>
            </Box>

            {/* Year Level */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Year Level
              </Typography>
              <Typography fontWeight={600}>
                {currentStudent.current_year_level}
              </Typography>
            </Box>

            {/* Semester */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Semester
              </Typography>
              <Typography fontWeight={600}>{currentStudent.current_semester}</Typography>
            </Box>
            {/* Status */}
            <Box sx={{ flex: "1 1 45%" }}>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Typography
                fontWeight={600}
                sx={{
                  color:
                    currentStudent.enrollment_status === "Officially Enrolled"
                      ? "green"
                      : "orange",
                }}
              >
                {currentStudent.enrollment_status || "OLD (Regular)"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Registration Notice */}
      <Box
        sx={{
          bgcolor: "#ffebee",
          p: 2,
          borderRadius: 2,
          width: "100%",
          maxWidth: 750,
          textAlign: "center",
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{
                  color:
                    currentStudent.enrollment_status === "Officially Enrolled"
                      ? "green"
                      : "orange",
                }}>
          {currentStudent.enrollment_status || "New"}
        </Typography>
      </Box>
    </Box>
  );
}
