import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";

import Logo from "../components/Logo";
import { useAuth } from "../contexts/useAuth";
import { Avatar, Button, Menu, MenuItem, Stack } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle"; // For Add Product icon

function MainHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout(() => {});
  };

  const handleGetCustomerList = () => {
    navigate("/customer-list"); // Assuming this route exists
  };

  const handleAddProduct = () => {
    navigate("/add-product"); // Assuming this route exists
  };
  return (
    <Box>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Logo />
          </IconButton>
          <Typography variant="h6" color="inherit" component="div">
            CoderStore
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {isAuthenticated ? (
            <>
              {/* Conditional rendering based on user role */}
              {user && user.role === "Consultant" && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleGetCustomerList}
                  sx={{
                    marginRight: 2,
                    backgroundColor: "white", // Transparent background
                    color: "#FF8243", // Orange text
                    "&:hover": {
                      borderColor: "orange", // Maintain the orange border color on hover
                      backgroundColor: "transparent", // Keep background transparent on hover
                      color: "white", // Keep text color orange on hover
                    },
                  }}
                >
                  Get Customer List
                </Button>
              )}

              {user && user.role === "Cashier" && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={handleAddProduct}
                  sx={{
                    marginRight: 2,
                    backgroundColor: "white", // Transparent background
                    color: "#FF8243", // Orange text
                    "&:hover": {
                      borderColor: "orange", // Maintain the orange border color on hover
                      backgroundColor: "transparent", // Keep background transparent on hover
                      color: "white", // Keep text color orange on hover
                    },
                  }}
                >
                  Add Product
                </Button>
              )}
              <Typography
                variant="h6"
                color="inherit"
                component="div"
                sx={{ marginRight: 2 }}
              >
                Welcome, {user?.username}!
              </Typography>
              <Avatar
                alt={user?.username}
                src={user?.avatarUrl} // If the user has an avatarUrl, use it
                onClick={handleAvatarClick}
                style={{ cursor: "pointer" }}
              />
              <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Stack direction="row" spacing={2}>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                color="primary"
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                color="primary"
              >
                Signup
              </Button>
            </Stack>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
