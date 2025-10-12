import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{display:"flex", width:"100%", justifyContent:"center", alignItems:"center"}}>
      <Box minWidth="sm" textAlign="center">
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" gutterBottom>
          Oops! Page not found.
        </Typography>
        <Typography variant="body1" color="textSecondary" gutterBottom>
          The page you are looking for does not exist or has been moved.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Go Back Home
        </Button>
      </Box>
    </Box>
  );
};

export default NotFound;
