import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  DialogActions,
  Stack,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import PrintIcon from "@mui/icons-material/Print";
import { useDispatch } from "react-redux";
import { getAllUsers, addUser, updateUser } from "../../actions/auth";
import jsPDF from "jspdf";
import "jspdf-autotable";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    password: "",
    usertype: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });

  const dispatch = useDispatch();
  const roles = ["admin", "cashier", "faculty","registrar","student"];

  // DataGrid columns
  const columns = [
    { field: "last_name", headerName: "Lastname", flex: 2 },
    { field: "first_name", headerName: "Firstname", flex: 2 },
    { field: "middle_name", headerName: "Middlename", flex: 2 },
    { field: "username", headerName: "Email", flex: 2 },
    { field: "usertype", headerName: "Role", flex: 2 },
    { field: "created_at", headerName: "Created At", flex: 2 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const fetchUsers = async () => {
    const result = await dispatch(getAllUsers());
    if (result.status === true) {
      setUsers(result.data);
    } else {
      console.error(result.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Filtered users based on selected role
  const filteredUsers = useMemo(() => {
    return roleFilter === "all"
      ? users
      : users.filter((u) => u.usertype === roleFilter);
  }, [users, roleFilter]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenDialog = () => {
    setFormData({
      first_name: "",
      middle_name: "",
      last_name: "",
      username: "",
      password: "",
      usertype: "",
    });
    setEditMode(false);
    setSelectedUserId(null);
    setOpenDialog(true);
  };

  const handleAddOrUpdate = async () => {
    if (
      !formData.username ||
      !formData.usertype ||
      !formData.first_name ||
      !formData.last_name
    ) {
      setSnackbar({
        open: true,
        message: "Firstname, Lastname, Username and Role are required.",
        severity: "warning"
      })
      return;
    }
    if (!editMode && !formData.password) {
      setSnackbar({
        open: true,
        message: "Firstname, Lastname, Username and Role are required.",
        severity: "warning"
      })
      return;
    }

    let response;
    setLoading(true)
    if (editMode) {
      const payload = {
        first_name: formData.first_name,
        middle_name: formData.middle_name,
        last_name: formData.last_name,
        username: formData.username,
        usertype: formData.usertype,
        ...(formData.password ? { password: formData.password } : {}),
      };
      response = await dispatch(updateUser(selectedUserId, payload));
    } else {
      response = await dispatch(addUser(formData));
    }
    if (response.status === true) {
      setSnackbar({
        open: true,
        message: editMode ? "User updated successfully!" : "User added successfully!",
        severity: "success"
      })
      fetchUsers();
      setLoading(false)
      setOpenDialog(false);
      setEditMode(false);
      setSelectedUserId(null);
    } else {
      setSnackbar({
        open: true,
        message: (editMode ? "Update" : "Add") + " failed: " + response.message,
        severity: "success"
      })
    }
  };

  const handleEdit = (user) => {
    setFormData({
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      username: user.username,
      password: "",
      usertype: user.usertype,
    });
    setEditMode(true);
    setSelectedUserId(user.id);
    setOpenDialog(true);
    console.log(user)
  };

  // const handlePrint = () => {
  //   window.print();
  // };
  const handlePrint = () => {
  const doc = new jsPDF("p", "mm", "a4"); // Portrait, millimeters, A4
  doc.setFont("helvetica", "normal");

  // Title
  doc.setFontSize(18);
  doc.text("User Management Report", 14, 20);

  // Subtitle
  doc.setFontSize(11);
  const currentDate = new Date().toLocaleString();
  doc.text(`Generated on: ${currentDate}`, 14, 28);

  // Table Data
  const tableColumn = ["#", "Lastname", "Firstname", "Middlename", "Username", "Role", "Created At"];
  const tableRows = filteredUsers.map((user, index) => [
    index + 1,
    user.last_name || "",
    user.first_name || "",
    user.middle_name || "",
    user.username || "",
    user.usertype || "",
    user.created_at ? new Date(user.created_at).toLocaleDateString() : "",
  ]);

  // Generate table
  doc.autoTable({
    startY: 35,
    head: [tableColumn],
    body: tableRows,
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [63, 81, 181], // MUI Blue
      textColor: 255,
      halign: "center",
    },
    bodyStyles: {
      halign: "center",
    },
  });

  // Footer: total users
  const finalY = doc.lastAutoTable.finalY || 35;
  doc.setFontSize(12);
  doc.text(`Total Users: ${filteredUsers.length}`, 14, finalY + 10);

  // Save the PDF
  doc.save(`User_List_${new Date().toISOString().split("T")[0]}.pdf`);
};


  return (
    <Box sx={{ p: 3, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        User Management
      </Typography>

      <Card sx={{ p: 2, mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            {/* Role Filter */}
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Role</InputLabel>
              <Select
                value={roleFilter}
                label="Filter by Role"
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                {roles.map((role, idx) => (
                  <MenuItem key={idx} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Add User Button */}
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Add New User
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {/* DataGrid */}
          <div style={{ height: '70vh', width: "100%" }} className="print-area">
            <DataGrid
              rows={filteredUsers}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
              getRowId={(row) => row.id}
            />
          </div>

          {/* Footer: total + print */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={2}
          >
            <Typography variant="subtitle1">
              Total Users: {filteredUsers.length}
            </Typography>

            <Button
              variant="outlined"
              color="secondary"
              startIcon={<PrintIcon />}
              onClick={handlePrint}
            >
              Print List
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: { borderRadius: 3, p: 1.5 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 600, fontSize: "1.5rem", pb: 0 }}>
          {editMode ? "Edit User Details" : "Add New User"}
        </DialogTitle>
        <DialogContent dividers sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            {editMode
              ? "Update the user information below and click 'Update' to save changes."
              : "Fill out the form below to register a new user in the system."}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField label="First Name" name="first_name" fullWidth value={formData.first_name || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Middle Name" name="middle_name" fullWidth value={formData.middle_name || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Last Name" name="last_name" fullWidth value={formData.last_name || ""} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" name="username" fullWidth value={formData.username} onChange={handleChange} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Password" type="password" name="password" fullWidth value={formData.password} onChange={handleChange} placeholder={editMode ? "Leave blank to keep current password" : ""} />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select name="usertype" value={formData.usertype} onChange={handleChange} >
                  {roles.map((role, idx) => (
                    <MenuItem key={idx} value={role}> {role} </MenuItem> ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button
            onClick={() => setOpenDialog(false)}
            color="inherit"
            variant="outlined"
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddOrUpdate}
            sx={{ borderRadius: 2, minWidth: 140 }}
            disabled={loading} // disable when loading
            startIcon={
              loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : editMode ? (
                <EditIcon />
              ) : (
                <AddIcon />
              )
            }
          >
            {loading
              ? (editMode ? "Updating..." : "Adding...")
              : (editMode ? "Update User" : "Add User")}
          </Button>

        </DialogActions>
      </Dialog>
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
            sx={{ width: "100%" }}
            >
              {snackbar.message}
          </Alert>
        </Snackbar>
    </Box>
  );
}
