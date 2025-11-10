import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import PortalPage from "../pages/Portal";

const WelcomeLayout = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Typography variant="h3" fontWeight="bold" gutterBottom>
        Welcome to the Gender & Development Portal
      </Typography>
      <Typography variant="h6" color="textSecondary" sx={{ mb: 3 }}>
        Promoting gender equality, inclusivity, and empowerment for all.
      </Typography>

      {/* PortalPage Component */}
      <Box>
        <PortalPage />
      </Box>

      {/* Get Started Button */}
      <Box>
        <Button
          variant="contained"
          color="primary"
          sx={{ px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "8px", mt: 2 }}
          onClick={() => navigate("/signin")}
        >
          Get Started
        </Button>
      </Box>

      {/* Additional Login Button
      <Box>
        <Button
          variant="outlined"
          color="secondary"
          sx={{ px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "8px", mt: 2 }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>
      </Box> */}
    </Container>
  );
};

export default WelcomeLayout;
