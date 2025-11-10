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
        console.log(result.data)
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

if (!currentStudent || currentStudent.length === 0) {
  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6" color="text.secondary">
        No enrollment data found.
      </Typography>
    </Box>
  );
}

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
    {currentStudent.length > 0 && (
      <Box
            sx={{
              display:'flex',
              justifyContent:'start'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "primary.main",
                fontWeight: "bold",
                textAlign: "left",
              }}
            >
              Welcome
              {", "}
              {currentStudent[0].students.last_name?.toUpperCase()}, {currentStudent[0].students.first_name}{" "}
              {currentStudent[0].students.middle_name} ({currentStudent[0].students.student_no})
            </Typography>
          </Box>
    )}
    {currentStudent.map((enrollment) => {
      const student = enrollment.students;
      return (
        <Box>
        <Card
          key={enrollment.id}
          sx={{
            width: "100%",
            maxWidth: 750,
            boxShadow: 4,
            borderRadius: 3,
            mb: 3,
          }}
        >
          <CardContent>
            {/* <Typography
              variant="h6"
              sx={{
                mb: 2,
                color: "primary.main",
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              {student.last_name?.toUpperCase()}, {student.first_name}{" "}
              {student.middle_name} ({student.student_no})
            </Typography> */}

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                flexWrap: "wrap",
                gap: 2,
              }}
            >
              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student Name
                </Typography>
                <Typography fontWeight={600}>
                  {student.last_name?.toUpperCase()},{" "}
                  {student.first_name?.toUpperCase()}{" "}
                  {student.middle_name?.toUpperCase()}
                </Typography>
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Student Number
                </Typography>
                <Typography fontWeight={600}>
                  {student.student_no}
                </Typography>
              </Box>
              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Program
                </Typography>
                <Typography fontWeight={600}>{enrollment.current_course}</Typography>
              </Box>

              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  School Year
                </Typography>
                <Typography fontWeight={600}>
                  {enrollment.current_school_year}
                </Typography>
              </Box>

              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Year Level
                </Typography>
                <Typography fontWeight={600}>
                  {enrollment.current_year_level}
                </Typography>
              </Box>

              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Semester
                </Typography>
                <Typography fontWeight={600}>
                  {enrollment.current_semester}
                </Typography>
              </Box>

              <Box sx={{ flex: "1 1 45%" }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Typography
                  fontWeight={600}
                  sx={{
                    color:
                      enrollment.enrollment_status === "Officially Enrolled"
                        ? "green"
                        : "orange",
                  }}
                >
                  {enrollment.enrollment_status || "OLD (Regular)"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
        </Box>
      );
    })}
  </Box>
);

}
