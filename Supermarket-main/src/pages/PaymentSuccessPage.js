import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Fade,
  Grow,
  Stack,
  Divider,
  alpha,
  useTheme,
  Card,
  CardContent
} from "@mui/material";
import {
  CheckCircle,
  ArrowBack,
  Home,
  ShoppingCart,
  Receipt
} from "@mui/icons-material";

function PaymentSuccessPage() {
  const { productid } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [showAnimation, setShowAnimation] = useState(false);

  // Animation effect
  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const { paymentSuccess, purchasedItems } = location.state || {};

  return (
    <Container maxWidth="md" sx={{ py: 5, minHeight: "100vh" }}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={() => navigate("/")}
        sx={{
          mb: 4,
          borderRadius: 2,
          px: 3,
          py: 1,
          transition: "all 0.2s",
          "&:hover": {
            transform: "translateX(-5px)",
          },
        }}
      >
        Back to Homepage
      </Button>

      <Fade in={showAnimation} timeout={800}>
        <Card
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            border: "1px solid",
            borderColor: "divider",
            boxShadow: `0 8px 30px ${alpha(theme.palette.success.main, 0.2)}`,
          }}
        >
          {/* Success Banner */}
          <Box
            sx={{
              bgcolor: "success.main",
              py: 3,
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
              "&::before": {
                content: '""',
                position: "absolute",
                width: "300px",
                height: "300px",
                background: `radial-gradient(circle, ${alpha(
                  "#fff",
                  0.2
                )} 0%, transparent 70%)`,
                top: "-150px",
                left: "20%",
                borderRadius: "50%",
              },
              "&::after": {
                content: '""',
                position: "absolute",
                width: "200px",
                height: "200px",
                background: `radial-gradient(circle, ${alpha(
                  "#fff",
                  0.15
                )} 0%, transparent 70%)`,
                bottom: "-100px",
                right: "10%",
                borderRadius: "50%",
              },
            }}
          >
            <Grow in={showAnimation} timeout={1000}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <CheckCircle
                  sx={{
                    fontSize: 72,
                    color: "white",
                    mb: 1,
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                />
                <Typography
                  variant="h4"
                  fontWeight="700"
                  sx={{ color: "white" }}
                >
                  Payment Successful!
                </Typography>
              </Box>
            </Grow>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h5"
                fontWeight="600"
                sx={{
                  mb: 1,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Thank You For Your Purchase
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your payment has been processed successfully. A confirmation email will be sent shortly.
              </Typography>
            </Box>

            {productid && (
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  bgcolor: alpha(theme.palette.success.main, 0.05),
                  border: "1px solid",
                  borderColor: alpha(theme.palette.success.main, 0.2),
                }}
              >
                <Typography variant="subtitle1" fontWeight="500">
                  Order Details:
                </Typography>
                <Divider sx={{ my: 1.5 }} />
                <Stack spacing={1}>
                  <Typography variant="body2">
                    <strong>Order ID:</strong> {productid || "ORD-" + Math.floor(Math.random() * 10000)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Date:</strong> {new Date().toLocaleDateString()}
                  </Typography>
                </Stack>
              </Paper>
            )}

            <Divider sx={{ mb: 3 }} />

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              justifyContent="center"
            >
              <Button
                variant="outlined"
                color="primary"
                startIcon={<Home />}
                onClick={() => navigate("/")}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  borderWidth: "2px",
                  fontWeight: 600,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 6px 15px ${alpha(
                      theme.palette.primary.main,
                      0.2
                    )}`,
                    borderWidth: "2px",
                  },
                }}
              >
                Continue Shopping
              </Button>
              <Button
                variant="contained"
                color="primary"
                startIcon={<Receipt />}
                // Update this onClick handler to pass the state
                onClick={() => navigate("/orders", { 
                  state: { 
                    paymentSuccess: paymentSuccess, 
                    purchasedItems: purchasedItems 
                  } 
                })}
                sx={{
                  borderRadius: 2,
                  py: 1.2,
                  px: 3,
                  fontWeight: 600,
                  boxShadow: `0 6px 12px ${alpha(
                    theme.palette.primary.main,
                    0.3
                  )}`,
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: `0 10px 16px ${alpha(
                      theme.palette.primary.main,
                      0.35
                    )}`,
                  },
                }}
              >
                View My Orders
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}

export default PaymentSuccessPage;