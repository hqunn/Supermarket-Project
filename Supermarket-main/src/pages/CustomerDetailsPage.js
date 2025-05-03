import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  Grid,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Avatar,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  alpha,
  useTheme
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowBack,
  Email,
  Phone,
  Home,
  ShoppingBag,
  Person,
  LocationOn
} from "@mui/icons-material";
import apiService from "../app/apiService";
import { useAuth } from "../contexts/useAuth";

function CustomerDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ensure only consultants can access this page
  useEffect(() => {
    if (!user || user.role !== "Consultant") {
      navigate("/");
    }
  }, [user, navigate]);

  // Fetch customer details and orders
  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        // Fetch customer details
        const customerResponse = await apiService.get(`/todos/profile/customer/${id}`);
        setCustomer(customerResponse.data);
        
        // Fetch customer orders if needed
        try {
          const ordersResponse = await apiService.get(`/todos/orders/${id}`);
          setOrders(ordersResponse.data || []);
        } catch (orderErr) {
          console.error("Failed to fetch customer orders:", orderErr);
          // Don't set an error - orders are optional
          setOrders([]);
        }
        
        setError("");
      } catch (err) {
        console.error("Failed to fetch customer details:", err);
        setError("Failed to load customer data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomerData();
    }
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Button 
        variant="outlined" 
        startIcon={<ArrowBack />}
        onClick={() => navigate("/customer-list")} 
        sx={{ mb: 4 }}
      >
        Back to Customer List
      </Button>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      ) : !customer ? (
        <Alert severity="warning">Customer not found.</Alert>
      ) : (
        <>
          <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
            <Grid container spacing={4}>
              {/* Customer Avatar */}
              <Grid item xs={12} md={3}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar 
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      mb: 2,
                      bgcolor: theme.palette.primary.main,
                      fontSize: '4rem'
                    }}
                  >
                    {customer.username?.charAt(0).toUpperCase() || 'C'}
                  </Avatar>
                  <Typography variant="h5" fontWeight="600" align="center">
                    {customer.username || 'Customer'}
                  </Typography>
                  <Chip 
                    label="Customer" 
                    color="primary" 
                    sx={{ mt: 1 }} 
                  />
                </Box>
              </Grid>

              {/* Customer Details */}
              <Grid item xs={12} md={9}>
                <Typography variant="h4" fontWeight="700" sx={{ mb: 3 }}>
                  Customer Profile
                </Typography>

                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 3, 
                    bgcolor: alpha(theme.palette.primary.main, 0.05),
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: alpha(theme.palette.primary.main, 0.1)
                  }}
                >
                  <List disablePadding>
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <Person color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Customer ID" 
                        secondary={customer.id || '-'}
                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <Email color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Email" 
                        secondary={customer.email || '-'}
                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <Phone color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Phone Number" 
                        secondary={customer.phonenumber || '-'}
                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                      />
                    </ListItem>
                    
                    <Divider variant="inset" component="li" />
                    
                    <ListItem sx={{ py: 1.5 }}>
                      <ListItemIcon>
                        <LocationOn color="primary" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Address" 
                        secondary={customer.address || '-'}
                        primaryTypographyProps={{ fontWeight: 600, color: 'text.primary' }}
                      />
                    </ListItem>
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </Paper>

          {/* Order History Section */}
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h4" fontWeight="700" sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
              <ShoppingBag sx={{ mr: 1 }} />
              Order History
            </Typography>

            {orders.length === 0 ? (
              <Alert severity="info">No order history found for this customer.</Alert>
            ) : (
              <Stack spacing={2}>
                {orders.map((orderData) => {
                  const order = orderData.order; // Extract the nested order object
                  return (
                    <Card 
                      key={order.id} 
                      variant="outlined"
                      sx={{ 
                        borderRadius: 2,
                        transition: 'all 0.3s',
                        '&:hover': {
                          boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item xs={6} md={3}>
                            <Typography color="text.secondary" variant="body2">Order ID</Typography>
                            <Typography fontWeight="600">{order.id}</Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography color="text.secondary" variant="body2">Date</Typography>
                            <Typography fontWeight="600">
                              {new Date(order.order_date).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography color="text.secondary" variant="body2">Payment Method</Typography>
                            <Typography fontWeight="600">{order.paymentmethod}</Typography>
                          </Grid>
                          <Grid item xs={6} md={3}>
                            <Typography color="text.secondary" variant="body2">Status</Typography>
                            <Chip
                              label={order.status}
                              size="small"
                              color={
                                order.status === 'Completed' ? 'success' :
                                order.status === 'Processing' ? 'info' :
                                order.status === 'Cancelled' ? 'error' :
                                'default'
                              }
                              sx={{ fontWeight: 600 }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </>
      )}
    </Container>
  );
}

export default CustomerDetailsPage;