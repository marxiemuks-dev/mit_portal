import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route } from "react-router-dom";
import DashboardLayout from "./layout/DashboardLayout";
import WelcomeLayout from "./layout/WelcomeLayout"
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound"

function App() {
  const [theme, colorMode] = useMode();

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/*" element={<DashboardLayout />} />
          <Route path="/landing/*" element={<WelcomeLayout />} />
          <Route path="/signin" element={<Login/>} />
          <Route path="/signup" element={<Register/>} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
