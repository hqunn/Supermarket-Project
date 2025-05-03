import React from "react";
import Typography from "@mui/material/Typography";
import { Box, Link } from "@mui/material";
import { AuthProvider } from "./contexts/useAuth";
import HomePage from "./pages/HomePage";
import ThemeProvider from "./contexts/ThemeProvider";
import Router from "./routes/index"; // Assuming your routes are in this component

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
