import * as React from "react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  CircularProgress,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Container,
  Divider,
  alpha,
  useTheme,
  Stack,
  Grid,
} from "@mui/material";
import { 
  ShoppingCart,
  Payment,
  LocalShipping,
  CheckCircle,
  CreditCard,
  Money,
  AccountBalance,
  Wallet,
  ArrowBack
} from "@mui/icons-material";
import { useAuth } from "../contexts/useAuth";
import apiService from "../app/apiService";
import { fCurrency } from "../utils";

export default function PaymentPageAll() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();

  const [paymentMethod, setPaymentMethod] = useState("");
  const [error, setError] = useState("");
  const [cart, setCart] = useState(location.state?.cart || []); 
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(!location.state?.cart);

  // Fetch customer profile
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required");
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        const res = await apiService.get(`/todos/profile/customer/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomer(res.data);
        setError("");
      } catch (err) {
        console.error("Failed to load profile:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user, navigate]);

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleProceedPayment = async () => {
    setError("");
  
    if (!paymentMethod) {
      setError("Please select a payment method!");
      return;
    }
    if (!customer?.id) {
      setError("Could not determine your customer ID.");
      return;
    }
  
    setLoading(true);
  
    try {
      // Create payload for multiple products
      const products = cart.map((item) => ({
        productID: item.id,
        quantity: item.quantity,
      }));
  
      const payload = {
        customerID: customer.id,
        products: products,
        paymentmethod: paymentMethod,
      };
  
      console.log("Placing order with payload:", payload);
  
      const res = await apiService.post("/todos/ordersAll", payload);
  
      if (res.status === 201 && res.data.orderID) {
        // Change this navigation to go to the success page instead of orders page
        navigate(`/payment-success/${res.data.orderID}`, {
          state: { 
            paymentSuccess: true, 
            purchasedItems: cart 
          }
        });
      } else {
        setError("Unexpected server response.");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      setError(
        err.response?.data?.error ||
          "Failed to process your order. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getPaymentIcon = (method) => {
    switch(method) {
      case "Cash": return <Money />;
      case "Credit Card": return <CreditCard />;
      case "Debit Card": return <AccountBalance />;
      case "Online": return <Wallet />;
      default: return <Payment />;
    }
  };

  // Calculate total amount
  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Button 
        variant="outlined" 
        onClick={() => navigate("/orders", { state: { cart } })} 
        sx={{ 
          mb: 4, 
          borderRadius: 2,
          px: 3,
          py: 1,
          transition: 'all 0.2s',
          '&:hover': {
            transform: 'translateX(-5px)'
          }
        }}
        startIcon={<ArrowBack />}
      >
        Back to Cart
      </Button>
      
      {/* Checkout Process Steps */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 1, 
          mb: 4, 
          borderRadius: 3,
          bgcolor: alpha(theme.palette.primary.main, 0.03),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.1)
        }}
      >
        <Stepper activeStep={1} alternativeLabel>
          <Step>
            <StepLabel>Cart</StepLabel>
          </Step>
          <Step>
            <StepLabel>Payment</StepLabel>
          </Step>
          <Step>
            <StepLabel>Confirmation</StepLabel>
          </Step>
        </Stepper>
      </Paper>
      
      <Box sx={{ display: 'flex', flexDirection: {xs: 'column', md: 'row'}, gap: 3 }}>
        {/* Left side - Cart Summary */}
        <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 3, mb: {xs: 3, md: 0} }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ 
            pb: 1,
            borderBottom: '2px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            display: 'flex',
            alignItems: 'center'
          }}>
            <ShoppingCart sx={{ mr: 1, color: 'primary.main' }} />
            Order Summary ({cart.length} {cart.length > 1 ? "items" : "item"})
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {!loading && error && (
            <Alert severity="error" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          
          {!loading && cart.length > 0 && (
            <Box sx={{ mt: 3 }}>
              {/* List of products in cart */}
              <Stack spacing={2} sx={{ maxHeight: 300, overflowY: 'auto', mb: 3, pr: 1 }}>
                {cart.map((product) => (
                  <Paper
                    key={product.id}
                    elevation={0}
                    sx={{ 
                      p: 2, 
                      borderRadius: 2, 
                      border: '1px solid',
                      borderColor: 'divider',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 60, 
                        height: 60, 
                        borderRadius: 1,
                        overflow: 'hidden',
                        mr: 2,
                        flexShrink: 0,
                        border: '1px solid',
                        borderColor: 'divider'
                      }}
                    >
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="subtitle1" fontWeight="600" noWrap>
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {fCurrency(product.price)} × {product.quantity}
                        </Typography>
                        <Typography variant="body1" fontWeight="600" color="primary.main">
                          {fCurrency(product.price * product.quantity)}
                        </Typography>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </Stack>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Order total calculation */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography fontWeight="600">{fCurrency(totalAmount)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography fontWeight="600" color="success.main">Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">Total</Typography>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  {fCurrency(totalAmount)}
                </Typography>
              </Box>
              
              {/* Shipping Address */}
              {customer && (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Paper 
                    elevation={0} 
                    sx={{ 
                      p: 2, 
                      bgcolor: alpha(theme.palette.primary.main, 0.03),
                      borderRadius: 2
                    }}
                  >
                    <Typography variant="body2">
                      <strong>{customer.username}</strong><br />
                      {customer.address}<br />
                      {customer.phonenumber}
                    </Typography>
                  </Paper>
                </>
              )}
            </Box>
          )}
        </Paper>

        {/* Right side - Payment method */}
        <Paper elevation={2} sx={{ flex: 1, p: 3, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight="600" sx={{ 
            pb: 1,
            borderBottom: '2px solid',
            borderColor: alpha(theme.palette.primary.main, 0.2),
            display: 'flex',
            alignItems: 'center'
          }}>
            <Payment sx={{ mr: 1, color: 'primary.main' }} />
            Payment Method
          </Typography>
          
          <FormControl component="fieldset" fullWidth sx={{ mt: 3 }}>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: 500 }}>
              Select your preferred payment method
            </FormLabel>
            
            <RadioGroup
              name="payment-method"
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <Stack spacing={1.5}>
                {["Cash", "Credit Card", "Debit Card", "Online"].map((method) => (
                  <Paper 
                    key={method}
                    elevation={0} 
                    sx={{ 
                      borderRadius: 2, 
                      border: '1px solid',
                      borderColor: paymentMethod === method 
                        ? 'primary.main' 
                        : 'divider',
                      bgcolor: paymentMethod === method 
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'transparent',
                      '&:hover': {
                        borderColor: 'primary.light',
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <FormControlLabel
                      value={method}
                      control={<Radio color="primary" />}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              mr: 1, 
                              color: paymentMethod === method ? 'primary.main' : 'text.secondary',
                              display: 'flex'
                            }}
                          >
                            {getPaymentIcon(method)}
                          </Box>
                          <Typography>{method === "Online" ? "Online Payment" : method}</Typography>
                        </Box>
                      }
                      sx={{ 
                        mx: 0,
                        py: 1.5,
                        px: 2,
                        width: '100%'
                      }}
                    />
                  </Paper>
                ))}
              </Stack>
            </RadioGroup>
          </FormControl>
          
          <Box sx={{ mt: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                We'll use your saved address for delivery. Please ensure your information is up to date in your profile.
              </Typography>
            </Alert>

            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={handleProceedPayment}
              disabled={loading || !paymentMethod}
              startIcon={loading ? null : <CheckCircle />}
              sx={{ 
                py: 1.5,
                borderRadius: 2,
                boxShadow: '0 6px 12px rgba(255, 130, 67, 0.2)',
                transition: 'all 0.3s',
                fontWeight: 600,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 16px rgba(255, 130, 67, 0.3)'
                }
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Confirm Payment"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}