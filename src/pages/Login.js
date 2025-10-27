import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Grid,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login, getAllUsers, updateUser, updateUserPassword } from "../actions/auth";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot password states
  const [openForgotDialog, setOpenForgotDialog] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  useEffect(() => {
    const storedUser = localStorage.getItem("mitportal_user");
    if (storedUser) navigate("/");
  }, [navigate]);

  // 🟢 Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      setMessage("Please fill in all fields.");
      setSeverity("warning");
      setOpenSnackbar(true);
      setIsLoading(false);
      return;
    }

    const loginData = await dispatch(login(username, password));
    const status = loginData.status;
    const message = loginData.message;

    if (!status) {
      setSeverity("error");
      setMessage(message);
      setOpenSnackbar(true);
    } else {
      setSeverity("success");
      setMessage(message);
      setOpenSnackbar(true);
      navigate("/");
    }
    setIsLoading(false);
  };

  // 🟢 Handle Forgot Password
  const handleForgotPassword = async () => {
    if (!forgotEmail) {
      setMessage("Please fill in all fields.");
      setSeverity("warning");
      setOpenSnackbar(true);
      return;
    }

    setForgotLoading(true);

    try {
      // Step 1: Get all users to find the one matching the email
      const result = await dispatch(getAllUsers());
      if (!result.status) throw new Error(result.message);

      const foundUser = result.data.find((u) => u.username === forgotEmail);
      if (!foundUser) {
        setMessage("No account found with this email.");
        setSeverity("error");
        setOpenSnackbar(true);
        setForgotLoading(false);
        return;
      }

      // Step 2: Update user password using your existing updateUser action
      const payload = { username: forgotEmail };
      const updateResult = await dispatch(updateUserPassword(foundUser.id, payload));

      if (updateResult.status) {
        setMessage(updateResult.message);
        setSeverity("success");
        setOpenSnackbar(true);
        setOpenForgotDialog(false);
        setForgotEmail("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setMessage("Failed to update password: " + updateResult.message);
        setSeverity("error");
        setOpenSnackbar(true);
      }
    } catch (err) {
      console.error(err);
      setMessage("An error occurred while resetting password.");
      setSeverity("error");
      setOpenSnackbar(true);
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSnackbar = () => setOpenSnackbar(false);

  return (
    <Box
      sx={{
        flexGrow: 1,
        p: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        background: "linear-gradient(to right, #e3f2fd, #ffffff)",
      }}
    >
      {/* Snackbar */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={handleSnackbar}
      >
        <Alert onClose={handleSnackbar} severity={severity}>
          {message}
        </Alert>
      </Snackbar>

      <Grid container spacing={4} justifyContent="center" alignItems="center" maxWidth="md">
        <Grid item xs={12} md={6} sx={{ textAlign: "center" }}>
          <Typography variant="h3" fontWeight="bold" color="primary" gutterBottom>
            MIT Portal System
          </Typography>
          <Typography variant="h6" color="text.secondary">
            With Notification
          </Typography>
          <Box mt={4}>
            <img src="MIT_logo.png" alt="system-logo" style={{ maxWidth: "200px" }} />
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card elevation={4}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" mb={3} textAlign="center">
                Login
              </Typography>

              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email"
                  fullWidth
                  margin="normal"
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <TextField
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  margin="normal"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
                  {isLoading ? <CircularProgress size={20} /> : "Login"}
                </Button>
              </form>

              <Button
                sx={{ mt: 2, textTransform: "none" }}
                onClick={() => setOpenForgotDialog(true)}
              >
                Forgot Password?
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Forgot Password Dialog */}
      <Dialog open={openForgotDialog} onClose={() => setOpenForgotDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>Forgot Password</DialogTitle>
        <DialogContent>
          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
          {/* <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          /> */}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgotDialog(false)}>Cancel</Button>
          <Button onClick={handleForgotPassword} variant="contained" disabled={forgotLoading}>
            {forgotLoading ? <CircularProgress size={20} /> : "Sent Reset Password"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Login;
