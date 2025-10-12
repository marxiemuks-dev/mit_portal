import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { useNavigate } from 'react-router-dom';
import { deepOrange, deepPurple } from '@mui/material/colors';

const settings = ['Profile','Account','Logout'];
const getRoleColor = (role) => {
  switch (role) {
    case "admin":
      return "#f44336"; // Red
    case "faculty":
      return "#1976d2"; // Blue
    case "student":
      return "#4caf50"; // Green
    default:
      return "#9e9e9e"; // Grey
  }
};
function ResponsiveAppBar() {
    const [user, setUser] = React.useState(null);

    const navigate = useNavigate();
    React.useEffect(() => {
      const storedUser = localStorage.getItem('mitportal_user');
      if (!storedUser) {
        navigate('/signin');
      } else {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (err) {
          console.error('Failed to parse user:', err);
          navigate('/signin');
        }
      }
    }, [navigate]);
    
    let pages = []
    let settings = [];

    if(user?.role === 'admin'){
      pages = [
        {id:1, pageName: "Dashboard", link: "" },
        {id:2, pageName: "Enrollment", link: "enrollment" },
        {id:3, pageName: "Schedule", link: "schedule" },
        {id:4, pageName: "Grades", link: "grades" },
        {id:6, pageName: "Calendar", link: "calendar" },
        {id:5, pageName: "Billing", link: "billing" },
        {id:7, pageName: "Notification", link: "notification" }
      ];
      settings = ['Profile','Account','Logout']
    }else if (user?.role === 'registrar'){
      pages = [
        {id:1, pageName: "Dashboard", link: "" },
        {id:2, pageName: "Enrollment", link: "enrollment" },
        {id:3, pageName: "Schedule", link: "schedule" },
        {id:4, pageName: "Grades", link: "grades" },
        {id:6, pageName: "Calendar", link: "calendar" },
        {id:7, pageName: "Notification", link: "notification" }
      ];
      settings = ['Profile','Logout']
    }
    else if(user?.role === 'student'){
      pages = [
        {id:2, pageName: "Enrollment", link: "" },
        {id:4, pageName: "Grades", link: "grades" },
        {id:7, pageName: "Notification", link: "notification" }
      ];
      settings = ['Profile','Logout']
    }else if(user?.role === 'faculty'){
      pages = [
        {id:2, pageName: "Schedule", link: "" },
        {id:4, pageName: "Grades", link: "grades" },
        {id:7, pageName: "Notification", link: "notification" }
      ];
      settings = ['Profile','Logout']
    }

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (value) => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Container sx={{minWidth:'100vw'}}>
        <Toolbar disableGutters>
          <Box sx={{display: { xs: 'none', md: 'flex', sm:'none' },}}>
            <img
              src="/logo.png" // Update this path to your image
              alt="logo"
              style={{
                display: { xs: 'none', md: 'flex', sm:'none' },
                marginRight: 6, // Uses the theme's spacing multiplier (8px)
                height: '50px', // Set an appropriate height
                width: 'auto'   // Maintain aspect ratio
              }}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }}}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' }}}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography sx={{ textAlign: 'center' }}>{page.pageName}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none', sm:'flex' },}}>
            <img
              src="/logo.png" // Update this path to your image
              alt="logo"
              style={{
                display: { xs: 'none', md: 'flex', sm:'none' },
                marginRight: 6, // Uses the theme's spacing multiplier (8px)
                height: '40px', // Set an appropriate height
                width: 'auto'   // Maintain aspect ratio
              }}
            />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            MIT Portal System
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }}}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                href={`/${page.link}`}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.pageName}
              </Button>
            ))}
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={`${user?.instructor_name} (${user?.role})`}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar
                sx={{
                  bgcolor: getRoleColor(user?.role),
                  cursor: "pointer",
                }}
                alt={user?.instructor_name} src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseUserMenu();
                  if (setting === "Logout") {
                    // Remove user data from localStorage
                    localStorage.removeItem("mitportal_user");
                    // Optional: redirect to login page
                    window.location.href = "/signin"; // change to your login route
                  }
                  else if(setting === "Account"){
                    navigate('/account')
                  }else if(setting === "Profile"){
                    navigate('/profile')
                  }
                }}
              >
                <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
              </MenuItem>
            ))}

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
