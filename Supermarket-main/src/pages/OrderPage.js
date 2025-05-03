import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  IconButton,
  Stack,
  Divider,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
  Card,
  CardContent,
  Badge,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Add, Remove, Delete, ShoppingCart, Receipt, ArrowBack, LocalShipping } from "@mui/icons-material";
import { fCurrency } from "../utils";
import { useAuth } from "../contexts/useAuth";
import apiService from "../app/apiService";

function OrderPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return location.state?.cart || (savedCart ? JSON.parse(savedCart) : []);
  });
  
  // State to track selected products
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // If returning from payment with success status, remove purchased items
  useEffect(() => {
    if (location.state?.paymentSuccess && location.state?.purchasedItems) {
      // Remove purchased items from cart
      const purchasedIds = location.state.purchasedItems.map(item => item.id);
      setCart(prev => prev.filter(item => !purchasedIds.includes(item.id)));
    }
  }, [location.state]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await apiService.get(`/todos/orders/${user.id}`);
        setOrders(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load order history");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const handleQuantityChange = (product, change) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id === product.id) {
          const newQuantity = item.quantity + change;
          if (newQuantity >= 1 && newQuantity <= 10) {
            return { ...item, quantity: newQuantity };
          }
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    setSelectedProducts(prev => prev.filter(id => id !== productId));
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      if (prev.includes(productId)) {
        return prev.filter(id => id !== productId);
      } else {
        return [...prev, productId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(cart.map(product => product.id));
    }
    setSelectAll(!selectAll);
  };

  // Calculate selected items and total
  const selectedItems = cart.filter(item => selectedProducts.includes(item.id));
  const selectedQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedTotal = selectedItems.reduce((total, product) => 
    total + product.price * product.quantity, 0);

  const handleCheckout = () => {
    if (selectedProducts.length === 0) {
      alert("Please select at least one product to checkout.");
      return;
    }
    
    // Navigate to payment with only selected products
    navigate("/payment", { 
      state: { 
        cart: cart.filter(item => selectedProducts.includes(item.id)) 
      } 
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'shipped': return 'primary';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5, minHeight: "100vh" }}>
      <Button
        variant="contained"
        startIcon={<ArrowBack />}
        sx={{ 
          mb: 4, 
          bgcolor: 'background.paper', 
          color: 'primary.main', 
          boxShadow: 1,
          '&:hover': { bgcolor: 'background.paper', opacity: 0.9 }
        }}
        onClick={() => navigate("/", { state: { cart } })}
      >
        Back to Homepage
      </Button>
      
      <Grid container spacing={4}>
        {/* Cart Section - Left Column */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ShoppingCart sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="700">
                Your Cart ({cart.length})
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {cart.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Your cart is empty
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }} 
                  onClick={() => navigate("/")}
                >
                  Start Shopping
                </Button>
              </Box>
            ) : (
              <>
                {/* Select All Checkbox */}
                <FormControlLabel
                  control={
                    <Checkbox 
                      checked={selectAll} 
                      onChange={handleSelectAll}
                      color="primary"
                    />
                  }
                  label={<Typography fontWeight="500">Select All Items</Typography>}
                  sx={{ mb: 2 }}
                />
                
                {cart.map((product) => (
                  <Card 
                    key={product.id} 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 2,
                      transition: 'all 0.3s',
                      border: selectedProducts.includes(product.id) ? '2px solid' : '1px solid',
                      borderColor: selectedProducts.includes(product.id) ? 'primary.main' : 'divider',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: 2
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Checkbox
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => handleSelectProduct(product.id)}
                          color="primary"
                        />
                        
                        <Box 
                          sx={{ 
                            mr: 2, 
                            borderRadius: 1.5, 
                            overflow: 'hidden',
                            border: '1px solid #eee',
                            width: 80,
                            height: 80,
                          }}
                        >
                          <img
                            onClick={() => navigate(`/product/${product.id}`)}
                            src={product.image}
                            alt={product.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                        </Box>
                        
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {product.name}
                          </Typography>
                          <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 600 }}>
                            {fCurrency(product.price)}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              bgcolor: 'background.paper',
                              border: '1px solid #e0e0e0',
                              borderRadius: 2,
                              px: 0.5
                            }}
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(product, -1)}
                              disabled={product.quantity <= 1}
                              sx={{ color: 'primary.main' }}
                            >
                              <Remove />
                            </IconButton>

                            <Typography
                              variant="body1"
                              sx={{ width: 40, textAlign: "center", fontWeight: 'bold' }}
                            >
                              {product.quantity}
                            </Typography>

                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(product, 1)}
                              disabled={product.quantity >= 10}
                              sx={{ color: 'primary.main' }}
                            >
                              <Add />
                            </IconButton>
                          </Paper>

                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(product.id)}
                            sx={{ ml: 1 }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {/* Checkout Summary */}
                <Paper 
                  elevation={3}
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    borderRadius: 2,
                    bgcolor: 'primary.main',
                    color: 'white'
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={7}>
                      <Typography variant="body1" fontWeight={600}>
                        Selected: {selectedProducts.length} products ({selectedQuantity} items)
                      </Typography>
                      <Typography variant="h6" fontWeight={600}>
                        Subtotal:
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {fCurrency(selectedTotal)}
                      </Typography>
                    </Grid>
                    <Grid item xs={5} sx={{ textAlign: 'right' }}>
                    <Button
                      variant="contained"
                      size="large"
                      sx={{ 
                        px: 3,
                        py: 1.5,
                        bgcolor: 'white',
                        color: 'primary.main',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,0.9)'
                        }
                      }}
                      onClick={handleCheckout}
                      disabled={selectedProducts.length === 0}
                    >
                      Checkout Selected
                    </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )}
          </Paper>
        </Grid>
        
        {/* Orders History - Right Column */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Receipt sx={{ mr: 1.5, color: 'primary.main' }} />
              <Typography variant="h5" fontWeight="700">
                Order History
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress color="primary" />
              </Box>
            ) : error ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  Your order history is empty
                </Typography>
                <Button 
                  variant="contained" 
                  sx={{ mt: 2 }} 
                  onClick={() => navigate("/")}
                >
                  Start Shopping
                </Button>
              </Box>
            ) : orders.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="subtitle1" color="text.secondary">
                  You haven't placed any orders yet.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={3}>
                {orders.map((orderData, index) => {
                  const { order, products } = orderData;
                  return (
                    <Card 
                      key={order.id} 
                      sx={{ 
                        borderRadius: 2,
                        overflow: 'visible',
                        position: 'relative',
                        transition: 'all 0.3s',
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Box sx={{ 
                        position: 'absolute', 
                        top: -12, 
                        left: 16, 
                        bgcolor: 'background.paper',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: 1,
                        boxShadow: 1
                      }}>
                        <Typography variant="caption" fontWeight="bold" color="primary.main">
                          Order #{index + 1}
                        </Typography>
                      </Box>

                      <CardContent sx={{ pt: 3 }}>
                        <Grid container spacing={1} sx={{ mb: 1.5 }}>
                          <Grid item xs={4}>  {/* Change from xs={6} to xs={4} */}
                            <Typography variant="subtitle2" color="text.secondary">
                              Order Date
                            </Typography>
                            <Typography variant="body2">
                              {new Date(order.order_date).toLocaleDateString()}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>  {/* Change from xs={6} to xs={4} */}
                            <Typography variant="subtitle2" color="text.secondary">
                              Total Cost
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                              {fCurrency(order.total_cost)}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>  {/* Add this new Grid item */}
                            <Typography variant="subtitle2" color="text.secondary">
                              Payment Method
                            </Typography>
                            <Typography variant="body2">
                              {order.paymentmethod || "N/A"}
                            </Typography>
                          </Grid>
                        </Grid>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <LocalShipping sx={{ fontSize: 18, mr: 1, color: 'text.secondary' }} />
                          <Chip 
                            label={order.status} 
                            size="small" 
                            color={getStatusColor(order.status)}
                            sx={{ fontWeight: 600 }}
                          />
                        </Box>
                        
                        <Divider sx={{ my: 1.5 }} />
                        
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                          Items
                        </Typography>
                        
                        {Array.isArray(products) && products.length > 0 ? (
                          <Stack spacing={1}>
                            {products.map((product) => (
                              <Box 
                                key={product.product_id} 
                                sx={{ 
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  p: 1,
                                  bgcolor: 'background.paper',
                                  borderRadius: 1,
                                  '&:hover': { bgcolor: 'action.hover' }
                                }}
                              >
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {product.name} 
                                  <Typography component="span" color="text.secondary" sx={{ ml: 0.5 }}>
                                    x{product.quantity}
                                  </Typography>
                                </Typography>
                                
                                <Typography variant="body2" fontWeight="bold">
                                  {fCurrency(product.price * product.quantity)}
                                </Typography>
                              </Box>
                            ))}
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No products found.
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OrderPage;