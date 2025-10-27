import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  CircularProgress,
  Snackbar,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch } from "react-redux";
import { getAllUsers, updateUser,updateProfilePicture } from "../../actions/auth";
import { getAllStudents } from "../../actions/student";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ASSETS_URL from "../../API/ASSETS_URL";

export default function UserProfile() {
  const dispatch = useDispatch();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [openPictureDialog, setOpenPictureDialog] = useState(false);
  const [newPicture, setNewPicture] = useState(null);
  const [preview, setPreview] = useState(null);
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentList, setStudentList] = useState([]);

  const roles = ["student","registrar", "cashier", "faculty", "admin"];

  // ✅ Fetch user info
  const fetchUser = async () => {
    const storedUser = localStorage.getItem("mitportal_user");
    if (!storedUser) return;

    const parsedUser = JSON.parse(storedUser);
    setCurrentUser(parsedUser);

    const result = await dispatch(getAllUsers());
    if (result.status === true) {
      const currentUserData = result.data.find(
        (u) => u.id === parsedUser.user_id
      );
      if (currentUserData) {
        setUser(currentUserData);
        setFormData({
          first_name: currentUserData.first_name || "",
          middle_name: currentUserData.middle_name || "",
          last_name: currentUserData.last_name || "",
          username: currentUserData.username || "",
          password: "",
          usertype: currentUserData.usertype || "",
          profile_pic: currentUserData.profile_pic || "",
        });
      }
    }
  };

  // ✅ Fetch student info (if linked)
  const fetchApplicant = async () => {
    const result = await dispatch(getAllStudents());
    if (result.status === true) {
      const students = result.data.map((s) => ({
        id: s.id,
        studentNo: s.student_no,
        firstName: s.first_name,
        middleName: s.middle_name,
        lastName: s.last_name,
        gender: s.gender,
        lrn: s.lrn,
        guardianEmail: s.guardian_email,
        studentEmail: s.student_email,
        course: s.course,
      }));
      setStudentList(students);

      const storedUser = localStorage.getItem("mitportal_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const match = students.find((s) => s.id === parsedUser.userStudentID);
        if (match) setStudentInfo(match);
      }
    }
  };

  useEffect(() => {
    fetchUser();
    fetchApplicant();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleEdit = () => setEditMode(true);

  const handleSave = async () => {
    setLoading(true);
    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      username: formData.username,
      usertype: formData.usertype,
      ...(formData.password ? { password: formData.password } : {}),
    };

    const response = await dispatch(updateUser(user.id, payload));
    if (response.status === true) {
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
      setEditMode(false);
      fetchUser();
    } else {
      setSnackbar({
        open: true,
        message: "Update failed: " + response.message,
        severity: "error",
      });
    }
    setLoading(false);
  };

  const handlePrint = () => {
    if (!user) return;
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("User Profile", 14, 20);
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["Firstname", user.first_name || ""],
      ["Middlename", user.middle_name || ""],
      ["Lastname", user.last_name || ""],
      ["Username", user.username || ""],
      ["Role", user.usertype || ""],
      ["Created At", user.created_at ? new Date(user.created_at).toLocaleString() : ""],
    ];
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
    });

    // ✅ Include student info if available
    if (studentInfo) {
      doc.text("Student Information", 14, doc.lastAutoTable.finalY + 15);
      const studentTable = [
        ["Student No", studentInfo.studentNo],
        ["Full Name", `${studentInfo.firstName} ${studentInfo.lastName}`],
        ["Course", studentInfo.course],
        ["Gender", studentInfo.gender],
        ["LRN", studentInfo.lrn],
        ["Guardian Email", studentInfo.guardianEmail],
        ["Student Email", studentInfo.studentEmail],
      ];
      doc.autoTable({
        head: [["Field", "Value"]],
        body: studentTable,
        startY: doc.lastAutoTable.finalY + 20,
        theme: "grid",
      });
    }

    doc.save(`User_Profile_${user.username}.pdf`);
  };

  // ✅ Picture Upload Dialog Handlers
  const handleOpenPictureDialog = () => setOpenPictureDialog(true);
  const handleClosePictureDialog = () => {
    setOpenPictureDialog(false);
    setPreview(null);
    setNewPicture(null);
  };

  const handlePictureUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPicture(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handlePictureSave = async () => {
    if (!newPicture) {
      setSnackbar({
        open: true,
        message: "Please select an image first!",
        severity: "warning",
      });
      return;
    }

    const formDataPic = new FormData();
    formDataPic.append("profilePicture", newPicture);
    const result = await dispatch(updateProfilePicture(user.id, formDataPic));

    if (result.status === true) {
      setSnackbar({
        open: true,
        message: "Profile picture updated!",
        severity: "success",
      });
      fetchUser();
      setOpenPictureDialog(false);
    } else {
      setSnackbar({
        open: true,
        message: "Upload failed: " + result.message,
        severity: "error",
      });
    }
  };

  if (!user) return <Typography>Loading user profile...</Typography>;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        My Profile
      </Typography>

      {/* ✅ USER ACCOUNT CARD */}
      <Card
        sx={{
          maxWidth: 700,
          mx: "auto",
          p: 3,
          mb: 3,
          borderRadius: 3,
          boxShadow: 4,
          bgcolor: "white",
        }}
      >
        <CardContent>
          {/* Avatar + Upload */}
          <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Avatar
              sx={{ width: 100, height: 100, bgcolor: "#3f51b5", fontSize: 40 }}
              src={formData.profile_pic ? `${ASSETS_URL}${formData.profile_pic}` : ""}
            >
              {user.first_name ? user.first_name[0] : "U"}
            </Avatar>
            <Button
              variant="outlined"
              sx={{ mt: 2, textTransform: "none" }}
              onClick={handleOpenPictureDialog}
            >
              Change Profile Picture
            </Button>
          </Box>

          {/* User Fields */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                name="first_name"
                fullWidth
                value={formData.first_name}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Middle Name"
                name="middle_name"
                fullWidth
                value={formData.middle_name}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Last Name"
                name="last_name"
                fullWidth
                value={formData.last_name}
                onChange={handleChange}
                disabled={!editMode}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="username"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                disabled={true}
              />
            </Grid>
            {editMode && (
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Leave blank to keep current password"
                />
              </Grid>
            )}
          </Grid>

          {/* Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            mt={4}
          >
            {editMode ? (
              <>
                <Button variant="outlined" onClick={() => setEditMode(false)} disabled={loading}>
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  disabled={loading}
                  startIcon={loading ? <CircularProgress size={20} /> : <EditIcon />}
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </>
            ) : (
              <Button variant="contained" onClick={handleEdit}>
                Edit Profile
              </Button>
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* ✅ STUDENT INFORMATION CARD */}
      {studentInfo && (
        <Card
          sx={{
            maxWidth: 700,
            mx: "auto",
            mt: 4,
            p: 4,
            borderRadius: 3,
            boxShadow: 5,
            bgcolor: "white",
          }}
        >
          <Typography
            variant="h5"
            fontWeight="bold"
            textAlign="center"
            color="primary"
            mb={3}
          >
            Student Information
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, p: 2, bgcolor: "#f9fafc", borderRadius: 2 }}>
            <Typography><b>Student No:</b> {studentInfo.studentNo}</Typography>
            <Typography><b>LRN:</b> {studentInfo.lrn || "N/A"}</Typography>
            <Typography><b>Full Name:</b> {`${studentInfo.firstName} ${studentInfo.middleName || ""} ${studentInfo.lastName}`}</Typography>
            <Typography><b>Gender:</b> {studentInfo.gender}</Typography>
            <Typography><b>Course:</b> {studentInfo.course}</Typography>
            <Typography><b>Guardian Email:</b> {studentInfo.guardianEmail}</Typography>
            <Typography><b>Student Email:</b> {studentInfo.studentEmail}</Typography>
          </Box>
        </Card>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Change Profile Picture Dialog */}
      <Dialog open={openPictureDialog} onClose={handleClosePictureDialog} fullWidth maxWidth="xs">
        <DialogTitle>Change Profile Picture</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 2 }}>
            <Avatar src={preview || `${ASSETS_URL}${formData.profile_pic}`} sx={{ width: 150, height: 150 }} />
            <Button variant="outlined" component="label">
              Upload New Picture
              <input type="file" accept="image/*" hidden onChange={handlePictureUpload} />
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePictureDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePictureSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
