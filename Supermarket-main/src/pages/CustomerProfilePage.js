import React, { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Container,
  Stack,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Divider,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import apiService from "../app/apiService";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "../contexts/useAuth";

export default function CustomerProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token"); // Get token from localStorage
      if (!token) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        const res = await apiService.get(`/todos/profile/customer/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Include token in the header
        });
        console.log("Customer Info:", res.data);
        setCustomerInfo(res.data);
        setError("");
      } catch (err) {
        console.log("Failed to load profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const reloadProfile = () => {
    setCustomerInfo(null);
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token"); // Get token from localStorage
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    if (user?.id) {
      apiService
        .get(`/todos/profile/customer/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }, // Include token in the header
        })
        .then((res) => {
          console.log("Reloaded Customer Info:", res.data);
          setCustomerInfo(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log("Failed to reload profile:", err);
          setError("Failed to reload profile");
          setLoading(false);
        });
    }
  };

  return (
    <Container sx={{ py: 5, minHeight: "100vh" }}>
      <Button variant="contained" sx={{ mb: 3 }} onClick={() => navigate("/")}>
        Back to Homepage
      </Button>

      <Typography variant="h4" sx={{ mb: 4 }}>
        Customer Profile
      </Typography>

      <Button
        sx={{
          padding: "10px", // Cải thiện padding
          marginBottom: "20px", // Tạo khoảng cách từ phần tử phía trên
        }}
        variant="outlined"
        onClick={() => {}}
      >
        Reload Profile
      </Button>

      {loading ? (
        <LoadingScreen />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={6}>
          {/* Thông tin cá nhân */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%", backgroundColor: "#FF8243" }}>
              <CardContent
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Typography
                  variant="h5"
                  sx={{ mb: 2, color: "#FFFFFF", fontSize: "24px" }}
                >
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                {customerInfo ? (
                  <Stack spacing={2} sx={{ flexGrow: 1 }}>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          textDecoration: "underline",
                          fontSize: "20px",
                        }} // Thêm gạch dưới
                      >
                        Name
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                        {customerInfo.username}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          textDecoration: "underline",
                          fontSize: "20px",
                        }} // Thêm gạch dưới
                      >
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                        {customerInfo.address}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          textDecoration: "underline",
                          fontSize: "20px",
                        }} // Thêm gạch dưới
                      >
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                        {customerInfo.phonenumber}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          color: "#FFFFFF",
                          textDecoration: "underline",
                          fontSize: "20px",
                        }} // Thêm gạch dưới
                      >
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#FFFFFF" }}>
                        {customerInfo.address}
                      </Typography>
                    </Box>

                    {/* Di chuyển nút "Edit Information" xuống dưới cùng */}
                    <Box sx={{ mt: 2 }}>
                      <Button
                        variant="outlined"
                        sx={{
                          alignSelf: "flex-start",
                          color: "#FFFFFF", // Màu chữ của button
                          borderColor: "#FFFFFF", // Màu viền của button
                        }}
                        onClick={() => navigate("/profile/edit")}
                      >
                        Edit Information
                      </Button>
                    </Box>
                  </Stack>
                ) : (
                  <Typography color="text.secondary">
                    No customer info available.
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Avatar người dùng */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                p: 2,
                backgroundColor: "#FF8243",
              }}
            >
              <Avatar
                src={customerInfo?.avatarUrl || "/default-avatar.png"}
                alt={customerInfo?.username}
                sx={{ width: 200, height: 200 }}
              />
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}
